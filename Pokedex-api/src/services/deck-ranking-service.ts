export type DeckRank = "D" | "C" | "B" | "A" | "S";

export function calculateDeckRank(total: number): DeckRank {
  // 1. Validate type / NaN
  if (typeof total !== "number" || Number.isNaN(total)) {
    throw new Error("Total must be a valid number");
  }

  // 2. No negatives allowed
  if (total < 0) {
    throw new Error("Total must be >= 0");
  }

  // 3. Rank mapping
  if (total <= 399) return "D";
  if (total <= 499) return "C";
  if (total <= 599) return "B";
  if (total <= 799) return "A";
  return "S"; // total >= 800
}
