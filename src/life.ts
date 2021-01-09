interface Coordinate {
  column: number;
  row: number;
}

interface GameCells {
  [key: number]: boolean;
}

export default class Game {
  height: number;
  width: number;
  cells: GameCells;

  constructor(height: number, width: number, cells: GameCells) {
    this.height = height;
    this.width = width;
    this.cells = {};
  }

  _coordsToIndex(column: number, row: number): number {
    return row * this.height + column;
  }

  _indexToCoords(index: number): Coordinate {
    return {
      column: index % this.height,
      row: Math.floor(index / this.height),
    };
  }

  getCell(column: number, row: number): boolean | undefined {
    if (column < 0 || row < 0 || column >= this.width || row >= this.height)
      return undefined;
    return this.cells[this._coordsToIndex(column, row)];
  }

  flipCell(column: number, row: number) {
    if (column < 0 || row < 0 || column >= this.width || row >= this.height)
      throw "Invalid coordinates";
    const index = this._coordsToIndex(column, row);
    this.cells[index] = !this.cells[index];
  }

  setCell(column: number, row: number, isLiving: boolean) {
    this.cells[this._coordsToIndex(column, row)] = isLiving;
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
            if (this.getCell(i, j) === false)
              changed.push({ column: i, row: j });
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
