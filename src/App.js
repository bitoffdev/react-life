import { useEffect, useState } from "react";

import Game from "./life.ts";

const game = new Game(10, 10);
for (let i = 0; i < 10; i++)
  for (let j = 0; j < 10; j++) game.setCell(i, j, false);
game.setCell(2, 2, true);
game.setCell(3, 2, true);
game.setCell(2, 3, true);
game.setCell(1, 3, true);
game.setCell(2, 4, true);

function BoardView({ game }) {
  let body = "";
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) body += game.getCell(j, i) ? "X" : ".";
    body += "\n";
  }
  return <pre style={{ fontFamily: "monospace", fontSize: "3em" }}>{body}</pre>;
}

function App() {
  const [, setLifeInterval] = useState(null);
  const [gameView, setGameView] = useState(null);

  useEffect(() => {
    setLifeInterval((lifeInterval) => {
      if (lifeInterval) return lifeInterval;
      return setInterval(function () {
        game.next();
        setGameView(<BoardView game={game} />);
      }, 500);
    });
  }, [gameView]);

  return gameView;
}

export default App;
