export type DeckRank = "D" | "C" | "B" | "A" | "S";

export function calculateDeckRank(total: number): DeckRank {
  if (typeof total !== "number" || Number.isNaN(total)) {
    throw new Error("Total must be a valid number");
  }

  if (total < 0) {
    throw new Error("Total must be equal or above 0");
  }

  if (total <= 399) return "D";
  if (total <= 499) return "C";
  if (total <= 599) return "B";
  if (total <= 799) return "A";
  return "S";
}
