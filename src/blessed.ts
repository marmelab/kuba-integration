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

  const playerTurnText = blessed.box({
    top: "center",
    left: "90%",
    tags: true,
    content: `Player turn : ${gameState.currentPlayer.playerNumber}`,
  });

  const board = blessed.box({
    top: "center",
    left: "left",
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
        width: 7,
        height: 3,
        content: node.value === 0 ? "" : "\u2022",
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
  outerBoard.append(playerTurnText);
  outerBoard.append(board);
  SCREEN.render();
};
