const blessed = require("blessed");

import { moveMarble } from "./board";
import { MARBLE_INT_COLORS } from "./constants";
import { setGameStateOnDirectionSelected } from "./game";
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
    style: {
      bg: "yellow",
    },
  });

  const cardinalEastBox = blessed.box({
    top: "50%",
    left: "90%",
    width: 2,
    height: 1,
    content: "\u25bA",
  });

  cardinalEastBox.on("click", function () {
    setGameStateOnDirectionSelected(gameState, "E");
    renderScreenView(gameState);
  });

  const cardinalWestBox = blessed.box({
    top: "50%",
    left: "10%",
    content: "\u25c4",
    width: 2,
    height: 1,
  });

  cardinalWestBox.on("click", function () {
    setGameStateOnDirectionSelected(gameState, "W");
    renderScreenView(gameState);
  });

  const cardinalSouthBox = blessed.box({
    top: "90%",
    left: "50%",
    content: "\u25bc",
    width: 2,
    height: 1,
  });

  cardinalSouthBox.on("click", function () {
    setGameStateOnDirectionSelected(gameState, "S");
    renderScreenView(gameState);
  });

  const cardinalNorthBox = blessed.box({
    top: "10%",
    left: "50%",
    content: "\u25b2",
    width: 2,
    height: 1,
  });

  cardinalNorthBox.on("click", function () {
    setGameStateOnDirectionSelected(gameState, "N");
    renderScreenView(gameState);
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
    width: 57, //*8
    height: 29, // *4
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

  const playerOneCatchMarblesContainer = blessed.box({
    top: 0,
    left: 0,
    height: 2,
    width: 40,
    style: {
      bg: "grey",
    },
    content: "Reds get : ",
  });

  let marblesWonByRed = gameState.players[0].marblesWon;
  marblesWonByRed = [2, 2, 2, 3];

  for (let i = 0; i < marblesWonByRed.length; i++) {
    const marbleBox = blessed.box({
      top: 0,
      left: i * 2 + 10,
      width: 1,
      height: 1,
      tags: true,
      style: {
        fg: MARBLE_INT_COLORS[marblesWonByRed[i]],
        bg: "grey",
      },
      content: "{center}\u2022{/center}",
    });
    playerOneCatchMarblesContainer.append(marbleBox);
  }

  const playerTwoCatchMarblesContainer = blessed.box({
    top: 38,
    left: 0,
    height: 2,
    width: 40,
    style: {
      bg: "grey",
    },
    content: "Blues get : ",
  });

  const playerTwoCatchMarbles = blessed.box({
    top: 0,
    left: 0,
  });

  const nodes = gameState.graph.nodes;
  Object.keys(nodes).forEach((key) => {
    const node = nodes[key];
    if (node.value >= 1 && !node.isExit) {
      let tmpBox = blessed.box({
        top: node.y * 4,
        left: node.x * 8,
        width: 7,
        height: 3,
        content: node.value === 0 ? "" : "{center}\n\u2022{/center}",
        tags: true,
        style: {
          fg: MARBLE_INT_COLORS[node.value],
          bg: gameState.marbleClicked === node ? "yellow" : "",
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
  outerBoard.append(playerOneCatchMarblesContainer);
  outerBoard.append(playerTwoCatchMarblesContainer);

  SCREEN.append(playerTurnText);

  SCREEN.render();
};
