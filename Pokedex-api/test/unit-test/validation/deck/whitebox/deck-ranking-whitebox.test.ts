import { describe, it, expect } from "vitest";
import { calculateDeckRank } from "../../../../../src/services/deck-ranking-service.js";

type WBCase = {
  label: string;
  input: any;
  expectError?: boolean;
  expectedRank?: "D" | "C" | "B" | "A" | "S";
};

const cases: WBCase[] = [
  {
    label: "WB1: throws when total is not a number",
    input: "abc",
    expectError: true,
  },
  {
    label: "WB2: throws when total is NaN",
    input: NaN,
    expectError: true,
  },
  {
    label: "WB3: throws when total < 0",
    input: -1,
    expectError: true,
  },
  {
    label: "WB4: returns D when total <= 399 (e.g. 200)",
    input: 200,
    expectedRank: "D",
  },
  {
    label: "WB5: returns C when total <= 499 (e.g. 450)",
    input: 450,
    expectedRank: "C",
  },
  {
    label: "WB6: returns B when total <= 599 (e.g. 550)",
    input: 550,
    expectedRank: "B",
  },
  {
    label: "WB7: returns A when total <= 799 (e.g. 650)",
    input: 650,
    expectedRank: "A",
  },
  {
    label: "WB8: returns S when total >= 800 (e.g. 900)",
    input: 900,
    expectedRank: "S",
  },
];

describe("White-box tests for calculateDeckRank()", () => {
  cases.forEach((tc) => {
    if (tc.expectError) {
      it(tc.label, () => {
        expect(() => calculateDeckRank(tc.input)).toThrow();
      });
    } else {
      it(tc.label, () => {
        const result = calculateDeckRank(tc.input);
        expect(result).toBe(tc.expectedRank);
      });
    }
  });
});
