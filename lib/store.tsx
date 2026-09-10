"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Client-side state for the staff role: what has been ticked, passed, read and
 * sent during this shift. No backend is in scope, so it persists to
 * localStorage and is read through useSyncExternalStore so server and client
 * renders agree.
 */

const KEY = "mise.staff.v1";

interface Persisted {
  /** Checklist ticks in the live task runner, keyed by step id. */
  steps: Record<string, boolean>;
  /** Steps whose photo evidence has been captured, keyed by step id. */
  photos: Record<string, boolean>;
  /** Readiness checks passed, keyed by course id. */
  readiness: Record<string, boolean>;
  /** Notifications the staff member has opened. */
  readNotifications: string[];
  /** Handover pre-send checklist, keyed by item id. */
  handoverChecks: Record<string, boolean>;
  handoverSent: boolean;
  /** Service recovery steps worked through, keyed by step key. */
  recoverySteps: Record<string, boolean>;
  feedbackSent: boolean;
}

interface Snapshot extends Persisted {
  /** False during SSR and hydration, so first paint never flickers. */
  ready: boolean;
}

const EMPTY: Persisted = {
  steps: {},
  photos: {},
  readiness: {},
  readNotifications: [],
  handoverChecks: {},
  handoverSent: false,
  recoverySteps: {},
  feedbackSent: false,
};

const SERVER_SNAPSHOT: Snapshot = { ...EMPTY, ready: false };

let clientSnapshot: Snapshot | null = null;
const listeners = new Set<() => void>();

function readStorage(): Persisted {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Persisted>) };
  } catch {
    return EMPTY;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Snapshot {
  clientSnapshot ??= { ...readStorage(), ready: true };
  return clientSnapshot;
}

function getServerSnapshot(): Snapshot {
  return SERVER_SNAPSHOT;
}

function update(mutate: (state: Snapshot) => Persisted | null) {
  const next = mutate(getSnapshot());
  if (!next) return;

  clientSnapshot = { ...next, ready: true };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked or full — state still holds for this page view.
  }
  listeners.forEach((listener) => listener());
}

export function useStaffState() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleStep = useCallback((stepId: string) => {
    update((prev) => ({
      ...prev,
      steps: { ...prev.steps, [stepId]: !prev.steps[stepId] },
    }));
  }, []);

  const capturePhoto = useCallback((stepId: string) => {
    update((prev) => ({
      ...prev,
      photos: { ...prev.photos, [stepId]: true },
    }));
  }, []);

  const resetRun = useCallback((stepIds: string[]) => {
    update((prev) => {
      const steps = { ...prev.steps };
      const photos = { ...prev.photos };
      stepIds.forEach((id) => {
        delete steps[id];
        delete photos[id];
      });
      return { ...prev, steps, photos };
    });
  }, []);

  const passReadiness = useCallback((courseId: string) => {
    update((prev) => ({
      ...prev,
      readiness: { ...prev.readiness, [courseId]: true },
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    update((prev) =>
      prev.readNotifications.includes(id)
        ? null
        : { ...prev, readNotifications: [...prev.readNotifications, id] },
    );
  }, []);

  const markAllNotificationsRead = useCallback((ids: string[]) => {
    update((prev) => ({ ...prev, readNotifications: ids }));
  }, []);

  const toggleHandoverCheck = useCallback((id: string) => {
    update((prev) => ({
      ...prev,
      handoverChecks: { ...prev.handoverChecks, [id]: !prev.handoverChecks[id] },
    }));
  }, []);

  const sendHandover = useCallback(() => {
    update((prev) => (prev.handoverSent ? null : { ...prev, handoverSent: true }));
  }, []);

  const toggleRecoveryStep = useCallback((key: string) => {
    update((prev) => ({
      ...prev,
      recoverySteps: { ...prev.recoverySteps, [key]: !prev.recoverySteps[key] },
    }));
  }, []);

  const sendFeedback = useCallback(() => {
    update((prev) => (prev.feedbackSent ? null : { ...prev, feedbackSent: true }));
  }, []);

  return useMemo(
    () => ({
      ...state,
      toggleStep,
      capturePhoto,
      resetRun,
      passReadiness,
      markNotificationRead,
      markAllNotificationsRead,
      toggleHandoverCheck,
      sendHandover,
      toggleRecoveryStep,
      sendFeedback,
    }),
    [
      state,
      toggleStep,
      capturePhoto,
      resetRun,
      passReadiness,
      markNotificationRead,
      markAllNotificationsRead,
      toggleHandoverCheck,
      sendHandover,
      toggleRecoveryStep,
      sendFeedback,
    ],
  );
}
