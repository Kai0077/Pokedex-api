import { describe, it, expect } from "vitest";
import { validateGatherAllowed } from "../../../../src/validation/gather-validation.js";

const NOW = new Date(0);

function secondsAgo(sec: number): Date {
  return new Date(NOW.getTime() - sec * 1000);
}

// ---------------------------------------------------------
// REGEX MESSAGE PATTERNS
// ---------------------------------------------------------
const ERROR_COOLDOWN = /wait 60 minutes/i;

function runCase(
  lastGatherAt: Date | null,
  valid: boolean,
  msgPattern?: RegExp,
) {
  const act = () => validateGatherAllowed(lastGatherAt, NOW);

  if (valid) {
    expect(act).not.toThrow();
  } else {
    if (msgPattern) expect(act).toThrow(msgPattern);
    else expect(act).toThrow();
  }
}

describe("Gather Pokemons – Cooldown partition (E1–E7)", () => {
  it.each([
    {
      label: "E1: no previous gather",
      lastGatherAt: null,
      valid: true,
    },
    {
      label: "E2: 0 seconds ago",
      lastGatherAt: secondsAgo(0),
      valid: false,
      msg: ERROR_COOLDOWN,
    },
    {
      label: "E3: 0.01 seconds ago",
      lastGatherAt: secondsAgo(0.01),
      valid: false,
      msg: ERROR_COOLDOWN,
    },
    {
      label: "E4: 30 minutes ago",
      lastGatherAt: secondsAgo(1800),
      valid: false,
      msg: ERROR_COOLDOWN,
    },
    {
      label: "E5: 59:59 minutes ago",
      lastGatherAt: secondsAgo(3599.99),
      valid: false,
      msg: ERROR_COOLDOWN,
    },
    {
      label: "E6: 60 minutes (boundary)",
      lastGatherAt: secondsAgo(3600),
      valid: true,
    },
    {
      label: "E7: > 60 minutes",
      lastGatherAt: secondsAgo(3600.01),
      valid: true,
    },
  ])("$label -> valid: $valid", ({ lastGatherAt, valid, msg }) => {
    runCase(lastGatherAt, valid, msg);
  });
});
