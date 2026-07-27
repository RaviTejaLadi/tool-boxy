/**
 * Smart collage row sizes based on image count.
 * Examples: 1→[1], 2→[2], 3→[2,1], 4→[2,2], 5→[3,2], 6→[3,3], 7→[3,2,2], 8→[3,3,2], 9→[3,3,3]
 */
export function computeRowPattern(count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [1];
  if (count === 2) return [2];
  if (count === 3) return [2, 1];
  if (count === 4) return [2, 2];

  const cols = Math.ceil(Math.sqrt(count));
  const rows: number[] = [];
  let remaining = count;

  while (remaining > 0) {
    const take = Math.min(cols, remaining);
    rows.push(take);
    remaining -= take;
  }

  // Avoid a lonely single image on the last row when we can rebalance
  // e.g. [3, 3, 1] → [3, 2, 2]
  if (rows.length >= 2 && rows[rows.length - 1] === 1) {
    const prev = rows.length - 2;
    if (rows[prev] > 2) {
      rows[prev] -= 1;
      rows[rows.length - 1] = 2;
    }
  }

  return rows;
}

export function chunkByPattern<T>(items: readonly T[], pattern: number[]): T[][] {
  const rows: T[][] = [];
  let offset = 0;
  for (const size of pattern) {
    rows.push(items.slice(offset, offset + size) as T[]);
    offset += size;
  }
  return rows;
}

export function describeLayout(count: number): string {
  const pattern = computeRowPattern(count);
  if (pattern.length === 0) return '';
  return pattern.join(' × ');
}

export type GridDirection = 'left' | 'right' | 'up' | 'down' | 'up-left' | 'up-right' | 'down-left' | 'down-right';

/** Flat index → row/col within the smart layout pattern. */
export function indexToCell(index: number, pattern: number[]): { row: number; col: number } | null {
  let offset = 0;
  for (let row = 0; row < pattern.length; row++) {
    const size = pattern[row];
    if (index < offset + size) {
      return { row, col: index - offset };
    }
    offset += size;
  }
  return null;
}

export function cellToIndex(row: number, col: number, pattern: number[]): number | null {
  if (row < 0 || row >= pattern.length) return null;
  if (col < 0 || col >= pattern[row]) return null;
  let offset = 0;
  for (let r = 0; r < row; r++) offset += pattern[r];
  return offset + col;
}

function clampCol(col: number, rowSize: number): number {
  return Math.min(Math.max(col, 0), rowSize - 1);
}

/** Neighbor index in the collage grid, or null if blocked / missing. */
export function getNeighborIndex(index: number, count: number, direction: GridDirection): number | null {
  const pattern = computeRowPattern(count);
  const cell = indexToCell(index, pattern);
  if (!cell) return null;

  const deltas: Record<GridDirection, { dRow: number; dCol: number }> = {
    left: { dRow: 0, dCol: -1 },
    right: { dRow: 0, dCol: 1 },
    up: { dRow: -1, dCol: 0 },
    down: { dRow: 1, dCol: 0 },
    'up-left': { dRow: -1, dCol: -1 },
    'up-right': { dRow: -1, dCol: 1 },
    'down-left': { dRow: 1, dCol: -1 },
    'down-right': { dRow: 1, dCol: 1 },
  };

  const { dRow, dCol } = deltas[direction];
  const nextRow = cell.row + dRow;
  if (nextRow < 0 || nextRow >= pattern.length) return null;

  // Same-row left/right must stay in-bounds without clamping to another cell
  if (dRow === 0) {
    return cellToIndex(nextRow, cell.col + dCol, pattern);
  }

  const nextCol = clampCol(cell.col + dCol, pattern[nextRow]);
  // For pure up/down keep column affinity; for diagonals require the intended side exists
  if (dCol !== 0) {
    const intended = cell.col + dCol;
    if (intended < 0 || intended >= pattern[nextRow]) return null;
    return cellToIndex(nextRow, intended, pattern);
  }

  return cellToIndex(nextRow, nextCol, pattern);
}
