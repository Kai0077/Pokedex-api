export type DeckRank = "D" | "C" | "B" | "A" | "S";

export function calculateDeckRank(total: number): DeckRank {
  if (total <= 399) return "D";
  if (total <= 499) return "C";
  if (total <= 599) return "B";
  if (total <= 799) return "A";
  return "S"; // 800 and above
}
