interface Coordinate {
  column: number;
  row: number;
}

export default class Game {
  height: number;
  width: number;
  livingCells: Set<string>;

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
    this.livingCells = new Set();
  }

  getCell(column: number, row: number): boolean {
    return this.livingCells.has(`${column}:${row}`);
  }

  flipCell(column: number, row: number) {
    const k = `${column}:${row}`;
    if (this.livingCells.has(k)) this.livingCells.delete(k);
    else this.livingCells.add(k);
  }

  setCell(column: number, row: number, isLiving: boolean) {
    const k = `${column}:${row}`;
    if (isLiving) this.livingCells.add(k);
    else this.livingCells.delete(k);
  }

  countLivingNeighbors(column: number, row: number): number {
    let count = 0;
    for (let i = column - 1; i <= column + 1; i++)
      for (let j = row - 1; j <= row + 1; j++)
        count += this.getCell(i, j) ? 1 : 0;
    return count;
  }

  next() {
    // build up the list of cells that we need to flip in the first pass
    const changed: Array<Coordinate> = [];
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        switch (this.countLivingNeighbors(i, j)) {
          case 2:
            break;
          case 3:
            if (!this.getCell(i, j)) changed.push({ column: i, row: j });
            break;
          case 0:
          case 1:
          case 4:
            if (this.getCell(i, j)) changed.push({ column: i, row: j });
        }
      }
    }

    // apply the changes
    for (let i = 0; i < changed.length; i++) {
      this.flipCell(changed[i].column, changed[i].row);
    }
  }
}
