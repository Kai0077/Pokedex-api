import { describe, it, expect } from "vitest";
import { calculateDeckRank } from "../../../../../src/services/deck-ranking-service.js";

const ERR_NOT_NUMBER = /Total must be a valid number/i;
const ERR_NEGATIVE = /Total must be equal or above 0/i;

function runCase(
  total: any,
  valid: boolean,
  expectedRank?: "D" | "C" | "B" | "A" | "S",
  msgPattern?: RegExp,
) {
  const act = () => calculateDeckRank(total);

  if (valid) {
    expect(act()).toBe(expectedRank);
  } else {
    if (msgPattern) expect(act).toThrow(msgPattern);
    else expect(act).toThrow();
  }
}

describe("calculateDeckRank - WHITEBOX tests", () => {
  it.each([
    {
      label: "WB1: Not a number ('abc')",
      total: "abc",
      valid: false,
      msg: ERR_NOT_NUMBER,
    },
    {
      label: "WB2: NaN",
      total: NaN,
      valid: false,
      msg: ERR_NOT_NUMBER,
    },
    {
      label: "WB3: Negative value (-1)",
      total: -1,
      valid: false,
      msg: ERR_NEGATIVE,
    },
    {
      label: "WB4: D branch (200)",
      total: 200,
      valid: true,
      expected: "D",
    },
    {
      label: "WB5: C branch (450)",
      total: 450,
      valid: true,
      expected: "C",
    },
    {
      label: "WB6: B branch (550)",
      total: 550,
      valid: true,
      expected: "B",
    },
    {
      label: "WB7: A branch (650)",
      total: 650,
      valid: true,
      expected: "A",
    },
    {
      label: "WB8: S branch (900)",
      total: 900,
      valid: true,
      expected: "S",
    },
  ])("$label", ({ total, valid, expected, msg }) => {
    runCase(total, valid, expected as any, msg);
  });
});
