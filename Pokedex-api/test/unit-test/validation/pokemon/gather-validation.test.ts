import { describe, it, expect } from "vitest";
import { validateGatherAllowed } from "../../../../src/validation/gather-validation.js";

const NOW = new Date(0);

function secondsAgo(sec: number): Date {
  return new Date(NOW.getTime() - sec * 1000);
}

function runCase(lastGatherAt: Date | null, valid: boolean) {
  const act = () => validateGatherAllowed(lastGatherAt, NOW);

  if (valid) {
    expect(act).not.toThrow();
  } else {
    expect(act).toThrow();
  }
}

describe("Gather Pokemons – Cooldown partition (E1–E7)", () => {
  it.each([
    ["E1: no previous gather", null, true],
    ["E2: 0 sec ago", secondsAgo(0), false],
    ["E3: 1 sec ago", secondsAgo(0.01), false],
    ["E4: 1800 sec (30 min)", secondsAgo(1800), false],
    ["E5: 3599 sec", secondsAgo(3599.99), false],
    ["E6: 3600 sec (boundary)", secondsAgo(3600), true],
    ["E7: > 3600 sec", secondsAgo(3600.01), true],
  ])("%s", (_label, lastGatherAt, valid) => {
    runCase(lastGatherAt, valid);
  });
});
