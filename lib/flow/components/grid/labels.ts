import { getFillStrategy } from "@/lib/flow/strategies/fill-strategy";
import type { GridConfig } from "@/lib/flow/components/grid/schema";

/** 1-indexed labels for every cell — index 0 is unused. */
export function computeGridLabels(config: GridConfig): string[] {
  const labels = new Array<string>(config.cells + 1);
  const { linkedCells, finalCellText } = config;

  for (let i = 0; i < linkedCells.length - 1; i++) {
    labels[linkedCells[i]] = String(linkedCells[i + 1]);
  }
  labels[linkedCells[linkedCells.length - 1]] = finalCellText;

  const emptyPositions: number[] = [];
  for (let position = 1; position <= config.cells; position++) {
    if (!labels[position]) emptyPositions.push(position);
  }

  const fill = getFillStrategy(config.fillStrategy).fill(emptyPositions.length, {
    customListItems: config.customListItems,
  });
  emptyPositions.forEach((position, i) => {
    labels[position] = fill[i] ?? "";
  });

  return labels;
}
