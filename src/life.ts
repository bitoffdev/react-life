export default class Game {
  livingCells: Set<string>;

  constructor() {
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
    const neighborCounts = new Map<string, number>();

    const incrCount = (column: number, row: number, addend: number) =>
      neighborCounts.set(
        `${column}:${row}`,
        (neighborCounts.get(`${column}:${row}`) ?? 0) + addend
      );

    // generate the `neighborCounts` map
    this.livingCells.forEach((coordinateKey) => {
      const [column, row] = coordinateKey
        .split(":")
        .map((coordinate) => parseInt(coordinate));

      // make sure this living cell exists in neighborCounts so it will get updated if it has 0 neighbors
      incrCount(column, row, 0);

      // increment the 8 neighbors of this living cell
      for (let i = -1; i < 2; i++)
        for (let j = -1; j < 2; j++)
          if (i !== 0 || j !== 0) incrCount(column + i, row + j, 1);
    });

    // flip the cells
    neighborCounts.forEach((countOfNeighbors, coordinateKey) => {
      switch (countOfNeighbors) {
        case 2:
          break;
        case 3:
          this.livingCells.add(coordinateKey);
          break;
        case 0:
        case 1:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
          this.livingCells.delete(coordinateKey);
          break;
        default:
          console.error(
            `Unexpected count of neighbors: ${countOfNeighbors} for coordinate ${coordinateKey}`
          );
      }
    });
  }
}
