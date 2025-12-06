import { describe, it, expect } from "vitest";
import { calculateDeckRank } from "../../../../../src/services/deck-ranking-service.js";

describe("White-box tests for calculateDeckRank()", () => {
  // Branch 1: non-number
  it("throws when total is not a number", () => {
    expect(() => calculateDeckRank("abc" as any)).toThrow();
  });

  // Branch 2: NaN
  it("throws when total is NaN", () => {
    expect(() => calculateDeckRank(NaN)).toThrow();
  });

  // Branch 3: negative
  it("throws when total < 0", () => {
    expect(() => calculateDeckRank(-1)).toThrow();
  });

  // Branch 4: D
  it("returns D when total <= 399", () => {
    expect(calculateDeckRank(200)).toBe("D");
  });

  // Branch 5: C
  it("returns C when total <= 499", () => {
    expect(calculateDeckRank(450)).toBe("C");
  });

  // Branch 6: B
  it("returns B when total <= 599", () => {
    expect(calculateDeckRank(550)).toBe("B");
  });

  // Branch 7: A
  it("returns A when total <= 799", () => {
    expect(calculateDeckRank(650)).toBe("A");
  });

  // Branch 8: S
  it("returns S when total >= 800", () => {
    expect(calculateDeckRank(900)).toBe("S");
  });
});
