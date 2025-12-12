export const GATHER_COOLDOWN_SECONDS = 3600;

/**
 * Throws if gather is NOT allowed.
 * Returns void if gather is allowed.
 */
export function validateGatherAllowed(
  lastGatherAt: Date | null,
  now: Date,
): void {
  if (!lastGatherAt) {
    return;
  }

  const diffSeconds = (now.getTime() - lastGatherAt.getTime()) / 1000;

  if (diffSeconds < GATHER_COOLDOWN_SECONDS) {
    throw new Error("You must wait 60 minutes before gathering again.");
  }
}
