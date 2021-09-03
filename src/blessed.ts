const blessed = require("blessed");

import { MARBLE_INT_COLORS } from "./constants";
import { GameState, Graph } from "./types";

let SCREEN: any;

export const initScreenView = (): void => {
  SCREEN = blessed.screen({
    smartCSR: true,
  });

  SCREEN.title = "Kuba Konsole";
  SCREEN.key(["escape", "q", "C-c"], function (ch: any, key: any) {
    return process.exit(0);
  });

  SCREEN.render();
};

export const renderScreenView = (gameState: GameState) => {
  const outerBoard = blessed.box({
    top: "center",
    left: "center",
    width: 80,
    height: 40,
  });

  const cardinalEastBox = blessed.box({
    top: "50%",
    left: "90%",
    width: 2,
    height: 1,
    content: "\u25bA",
  });

  const cardinalWestBox = blessed.box({
    top: "50%",
    left: "10%",
    content: "\u25c4",
    width: 2,
    height: 1,
  });

  const cardinalNorthBox = blessed.box({
    top: "90%",
    left: "50%",
    content: "\u25bc",
    width: 2,
    height: 1,
  });

  const cardinalSouthBox = blessed.box({
    top: "10%",
    left: "50%",
    content: "\u25b2",
    width: 2,
    height: 1,
  });

  const playerTurnText = blessed.box({
    top: "center",
    left: "80%",
    tags: true,
    content: `Player turn : ${gameState.currentPlayer.playerNumber}`,
  });

  const board = blessed.box({
    top: "center",
    left: "center",
    width: 56, //*8
    height: 28, // *4
    tags: true,
    border: {
      type: "line",
    },
    style: {
      border: {
        fg: "white",
      },
    },
  });
  const nodes = gameState.graph.nodes;
  Object.keys(nodes).forEach((key) => {
    const node = nodes[key];
    if (node.value >= 1) {
      let tmpBox = blessed.box({
        top: node.y * 4,
        left: node.x * 8,
        width: 6,
        height: 2,
        content: node.value === 0 ? "" : "{center}\u2022{/center}",
        tags: true,
        style: {
          fg: MARBLE_INT_COLORS[node.value],
          bg: (gameState.marbleClicked === node) ? 'yellow' : '',
        },
      });
      tmpBox.on("click", function () {
        gameState.marbleClicked = node;
        renderScreenView(gameState);
      });
      board.append(tmpBox);
    }
  });

  SCREEN.append(outerBoard);
  outerBoard.append(board);
  outerBoard.append(cardinalEastBox);
  outerBoard.append(cardinalWestBox);
  outerBoard.append(cardinalNorthBox);
  outerBoard.append(cardinalSouthBox);


  SCREEN.append(playerTurnText);
  
  
  SCREEN.render();
};