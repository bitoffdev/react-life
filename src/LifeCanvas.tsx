import { useEffect, useRef, useState } from "react";

import Game from "./life";
import useResizeObserver from "use-resize-observer";

interface LifeCanvasProps {
  cellPixelWidth: number;
  className?: string;
  game: Game | null;
  intervalMillis: number;
  isRunning: boolean;
}

const render = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  game: Game | null,
  cellPixelWidth: number
) => {
  if (!game) return;

  const canvasDom = canvasRef.current;
  const context = canvasDom?.getContext("2d");
  if (context == null) return;

  const width = context.canvas.width;
  const height = context.canvas.height;
  const numberOfColumns = Math.max(1, Math.floor(width / cellPixelWidth));
  const numberOfRows = Math.max(1, Math.floor(height / cellPixelWidth));

  const lowestColumn = -Math.floor(numberOfColumns / 2);
  const lowestRow = -Math.floor(numberOfRows / 2);

  for (let row = lowestRow; row <= lowestRow + numberOfRows; row++) {
    for (
      let column = lowestColumn;
      column <= lowestColumn + numberOfColumns;
      column++
    ) {
      context.fillStyle = game.getCell(column, row)
        ? "rgb(0,0,0)"
        : "rgb(255,255,255)";
      context.fillRect(
        (column - lowestColumn) * cellPixelWidth,
        (row - lowestRow) * cellPixelWidth,
        cellPixelWidth,
        cellPixelWidth
      );
    }
  }
};

export default function LifeCanvas(props: LifeCanvasProps) {
  const { cellPixelWidth } = props;

  const [, setLifeInterval] = useState<NodeJS.Timeout | null>(null);
  // note: the initialValue of null must be passed to useRef for typescript
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/35572#issuecomment-498242139
  // const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [size, setSize] = useState<{ width?: number; height?: number }>({
    width: 200,
    height: 200,
  });
  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: (size) => setSize(size),
  });

  // do a single render when the game changes or the canvas size changes
  useEffect(() => render(canvasRef, props.game, cellPixelWidth), [
    cellPixelWidth,
    props.game,
    size,
  ]);

  // Only update when the props change. Don't update when the state changes.
  useEffect(
    () =>
      setLifeInterval((lifeInterval) => {
        // clear the previous interval
        if (lifeInterval) clearInterval(lifeInterval);
        // skip creating a new interval if we are not supposed to be running
        if (props.game == null || !props.isRunning) return null;
        // set a new interval
        return setInterval(function () {
          props.game?.next();
          render(canvasRef, props.game, props.cellPixelWidth);
        }, props.intervalMillis);
      }),
    [canvasRef, props]
  );

  return (
    <div
      className={props.className}
      ref={ref}
      style={{
        maxWidth: "100%",
        overflow: "hidden",
        minHeight: "100px",
        flex: 1,
      }}
    >
      <canvas ref={canvasRef} width={size.width} height={size.height} />
    </div>
  );
}
