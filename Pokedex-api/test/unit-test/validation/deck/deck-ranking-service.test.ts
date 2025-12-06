import { describe, it, expect } from "vitest";
import { calculateDeckRank } from "../../../../src/services/deck-ranking-service.js";

type Case = {
  label: string;
  total: number | any;
  expectRank?: "D" | "C" | "B" | "A" | "S";
  expectError?: boolean;
};

const cases: Case[] = [
  // ===== Invalid: total < 0 =====
  { label: "Total < 0 (−1)", total: -1, expectError: true },

  // ===== 0–399 → D =====
  { label: "0 (lower bound D)", total: 0, expectRank: "D" },
  { label: "1 (interior D)", total: 1, expectRank: "D" },
  { label: "200 (interior D)", total: 200, expectRank: "D" },
  { label: "398 (interior D, near upper)", total: 398, expectRank: "D" },
  { label: "399 (upper bound D)", total: 399, expectRank: "D" },

  // ===== 400–499 → C =====
  { label: "400 (lower bound C)", total: 400, expectRank: "C" },
  { label: "401 (interior C)", total: 401, expectRank: "C" },
  { label: "450 (middle C)", total: 450, expectRank: "C" },
  { label: "498 (interior C, near upper)", total: 498, expectRank: "C" },
  { label: "499 (upper bound C)", total: 499, expectRank: "C" },

  // ===== 500–599 → B =====
  { label: "500 (lower bound B)", total: 500, expectRank: "B" },
  { label: "501 (interior B)", total: 501, expectRank: "B" },
  { label: "550 (middle B)", total: 550, expectRank: "B" },
  { label: "598 (interior B, near upper)", total: 598, expectRank: "B" },
  { label: "599 (upper bound B)", total: 599, expectRank: "B" },

  // ===== 600–799 → A =====
  { label: "600 (lower bound A)", total: 600, expectRank: "A" },
  { label: "601 (interior A)", total: 601, expectRank: "A" },
  { label: "700 (middle A)", total: 700, expectRank: "A" },
  { label: "798 (interior A, near upper)", total: 798, expectRank: "A" },
  { label: "799 (upper bound A)", total: 799, expectRank: "A" },

  // ===== ≥ 800 → S =====
  { label: "800 (lower bound S)", total: 800, expectRank: "S" },
  { label: "801 (interior S)", total: 801, expectRank: "S" },
  { label: "900 (interior S)", total: 900, expectRank: "S" },
  { label: "1000 (large S)", total: 1000, expectRank: "S" },

  // ===== Invalid: non-numeric =====
  { label: 'Non-numeric total "abc"', total: "abc", expectError: true },
];

describe("calculateDeckRank(total)", () => {
  cases.forEach((tc) => {
    if (tc.expectError) {
      it(`throws for ${tc.label}`, () => {
        expect(() => calculateDeckRank(tc.total as any)).toThrow();
      });
    } else {
      it(`returns ${tc.expectRank} for ${tc.label}`, () => {
        const rank = calculateDeckRank(tc.total as number);
        expect(rank).toBe(tc.expectRank);
      });
    }
  });
});
