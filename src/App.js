import { useEffect, useState } from "react";

import Game from "./life.ts";

const game = new Game();
game.setCell(2, 2, true);
game.setCell(3, 2, true);
game.setCell(2, 3, true);
game.setCell(1, 3, true);
game.setCell(2, 4, true);

function BoardView({ game }) {
  let body = "";
  for (let i = -15; i < 15; i++) {
    for (let j = -30; j < 30; j++) body += game.getCell(j, i) ? "X" : ".";
    body += "\n";
  }
  return <pre style={{ fontFamily: "monospace", fontSize: "2em" }}>{body}</pre>;
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
      }, 200);
    });
  }, [gameView]);

  return gameView;
}

export default App;
