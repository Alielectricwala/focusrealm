import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import type { Candidate } from "./types";
import { createId, createToken } from "./security.server";

/**
 * Persistence for the onboarding module. SERVER ONLY.
 *
 * This is a JSON-file adapter: it runs anywhere Node can write to disk, which
 * covers local use and any long-lived host. It will NOT survive a serverless
 * deploy where the filesystem is ephemeral (Vercel included) — swap the four
 * functions at the bottom for a database client when the module moves there.
 * Nothing outside this file touches storage directly.
 */

const ROOT = process.env.ONBOARDING_DATA_DIR ?? join(process.cwd(), "data", "onboarding");
const DB = join(ROOT, "candidates.json");
export const UPLOAD_DIR = join(ROOT, "uploads");

/** Serialises read-modify-write cycles so concurrent requests can't clobber. */
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const run = queue.then(job, job);
  queue = run.catch(() => {});
  return run;
}

async function readAll(): Promise<Candidate[]> {
  try {
    return JSON.parse(await readFile(DB, "utf8")) as Candidate[];
  } catch {
    return [];
  }
}

async function writeAll(candidates: Candidate[]): Promise<void> {
  await mkdir(ROOT, { recursive: true });
  // Write to a temp file first so a crash mid-write can't truncate the store.
  const tmp = `${DB}.${randomBytes(4).toString("hex")}.tmp`;
  await writeFile(tmp, JSON.stringify(candidates, null, 2), "utf8");
  await rename(tmp, DB);
}

/* -------------------------------------------------------------------------- */
/* Reads                                                                      */
/* -------------------------------------------------------------------------- */

export async function listCandidates(): Promise<Candidate[]> {
  const all = await readAll();
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getCandidate(id: string): Promise<Candidate | null> {
  return (await readAll()).find((c) => c.id === id) ?? null;
}

export async function getCandidateByToken(token: string): Promise<Candidate | null> {
  const found = (await readAll()).find((c) => c.token === token) ?? null;
  return found?.archivedAt ? null : found;
}

/* -------------------------------------------------------------------------- */
/* Writes                                                                     */
/* -------------------------------------------------------------------------- */

export async function createCandidate(input: {
  invitedName: string;
  invitedEmail: string;
  track: Candidate["track"];
  startDate: string;
}): Promise<Candidate> {
  return enqueue(async () => {
    const candidate: Candidate = {
      id: createId(),
      token: createToken(),
      track: input.track,
      invitedName: input.invitedName,
      invitedEmail: input.invitedEmail,
      startDate: input.startDate,
      createdAt: new Date().toISOString(),
      resources: {},
      tests: {},
    };

    const all = await readAll();
    all.push(candidate);
    await writeAll(all);
    return candidate;
  });
}

/**
 * Applies `mutate` to one candidate and persists the result. The mutation runs
 * inside the queue against freshly-read state, so it always sees the latest
 * record rather than a stale copy the caller was holding.
 */
export async function updateCandidate(
  id: string,
  mutate: (candidate: Candidate) => Candidate,
): Promise<Candidate | null> {
  return enqueue(async () => {
    const all = await readAll();
    const index = all.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const next = mutate(all[index]);
    all[index] = next;
    await writeAll(all);
    return next;
  });
}

export async function saveUpload(
  file: File,
): Promise<{ storedAs: string; bytes: number }> {
  await mkdir(UPLOAD_DIR, { recursive: true });

  const storedAs = `${randomBytes(16).toString("hex")}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  // Uploads live outside public/ and are only served through an admin route.
  await writeFile(join(UPLOAD_DIR, storedAs), bytes, { mode: 0o600 });

  return { storedAs, bytes: bytes.byteLength };
}

export async function readUpload(storedAs: string): Promise<Buffer | null> {
  // Guard against traversal — stored names are always plain hex.
  if (!/^[a-f0-9]{32}$/.test(storedAs)) return null;

  try {
    return await readFile(join(UPLOAD_DIR, storedAs));
  } catch {
    return null;
  }
}
