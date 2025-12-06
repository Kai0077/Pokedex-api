import { describe, it, expect } from "vitest";
import { calculateDeckRank } from "../../../../src/services/deck-ranking-service.js";

// ---------------------------------------------------------
// REGEX MESSAGE PATTERNS
// ---------------------------------------------------------
const ERROR_BELOW_ZERO = /above 0/i;
const ERROR_NOT_NUMBER = /valid number/i;

function runCase(
  total: any,
  valid: boolean,
  expectedRank: any,
  msgPattern?: RegExp,
) {
  const act = () => calculateDeckRank(total);

  if (valid) {
    const rank = act();
    expect(rank).toBe(expectedRank);
  } else {
    if (msgPattern) expect(act).toThrow(msgPattern);
    else expect(act).toThrow();
  }
}

// ---------------------------------------------------------
// TESTS
// ---------------------------------------------------------
describe("calculateDeckRank", () => {
  it.each([
    // ===== Invalid =====
    {
      label: "total = -1 (invalid)",
      total: -1,
      valid: false,
      msg: ERROR_BELOW_ZERO,
    },
    {
      label: 'total = "abc" (invalid)',
      total: "abc",
      valid: false,
      msg: ERROR_NOT_NUMBER,
    },

    // ===== 0–399 => D =====
    { label: "total = 0", total: 0, valid: true, expected: "D" },
    { label: "total = 1", total: 1, valid: true, expected: "D" },
    { label: "total = 200", total: 200, valid: true, expected: "D" },
    { label: "total = 398", total: 398, valid: true, expected: "D" },
    { label: "total = 399", total: 399, valid: true, expected: "D" },

    // ===== 400–499 => C =====
    { label: "total = 400", total: 400, valid: true, expected: "C" },
    { label: "total = 450", total: 450, valid: true, expected: "C" },
    { label: "total = 498", total: 498, valid: true, expected: "C" },
    { label: "total = 499", total: 499, valid: true, expected: "C" },

    // ===== 500–599 => B =====
    { label: "total = 500", total: 500, valid: true, expected: "B" },
    { label: "total = 501", total: 501, valid: true, expected: "B" },
    { label: "total = 550", total: 550, valid: true, expected: "B" },
    { label: "total = 598", total: 598, valid: true, expected: "B" },
    { label: "total = 599", total: 599, valid: true, expected: "B" },

    // ===== 600–799 => A =====
    { label: "total = 600", total: 600, valid: true, expected: "A" },
    { label: "total = 601", total: 601, valid: true, expected: "A" },
    { label: "total = 700", total: 700, valid: true, expected: "A" },
    { label: "total = 798", total: 798, valid: true, expected: "A" },
    { label: "total = 799", total: 799, valid: true, expected: "A" },

    // ===== 800 and greater => S =====
    { label: "total = 800", total: 800, valid: true, expected: "S" },
    { label: "total = 801", total: 801, valid: true, expected: "S" },
    { label: "total = 900", total: 900, valid: true, expected: "S" },
    { label: "total = 1000", total: 1000, valid: true, expected: "S" },
  ])("$label", ({ total, valid, expected, msg }) => {
    runCase(total, valid, expected, msg);
  });
});
