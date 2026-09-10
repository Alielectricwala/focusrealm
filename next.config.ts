import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The onboarding handbooks are read at runtime from a path built at call
  // time, which the file tracer cannot follow — without this they are missing
  // from a serverless bundle and the handbook route 500s.
  outputFileTracingIncludes: {
    "/api/onboarding/session/[token]/resource/[resourceId]": [
      "./content/onboarding/**/*",
    ],
  },
};

export default nextConfig;
