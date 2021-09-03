import { Player, Board, UserMove, Graph, GameState } from "./types";
import {
  renderToConsole,
  renderBoard,
  marbleValuetoANSIColorCode,
} from "./renderBoard";
import { askUserMove, close } from "./userInput";
import { moveMarble } from "./board";
import { graphToBoard, sanitizeGraph, boardToGraph } from "./graph";
import { MARBLE_INT_COLORS } from "./constants";
import { initScreenView, renderScreenView } from "./blessed";

const blessed = require("blessed");

let gameState: GameState;

export const startNewGame = async (initialBoard: Board) => {
  let board = initialBoard;
  close();
  initScreenView();

  let players: Array<Player> = initializePlayers();

  let thisTurnPlayer: Player = players[0];

  let gameOver: Boolean = false;

  // render graph
  const graph = boardToGraph(board);

  const gameState = {
    graph,
    currentPlayer: thisTurnPlayer,
    players,
    marbleClicked: { x: -1, y: -1, value: -1, isExit: false },
    directionSelected: "",
    hasWinner: false,
  };

  renderScreenView(gameState);
};

const initializePlayers = () => {
  const player1: Player = {
    playerNumber: 1,
    marbleColor: 1,
    marblesWon: [],
  };

  const player2: Player = {
    playerNumber: 2,
    marbleColor: 2,
    marblesWon: [],
  };

  return [player1, player2];
};

export const switchToNextPlayer = (
  actualPlayer: Player,
  players: Array<Player>
): Player => {
  let nextPlayerIndex = players.indexOf(actualPlayer) + 1;

  if (nextPlayerIndex > players.length - 1) return players[0];
  return players[nextPlayerIndex];
};

export const marbleWonByPlayer = (graph: Graph): number => {
  if (!graph) {
    return -1;
  }

  for (const node of Object.values(graph.nodes)) {
    if (node.isExit && node.value > -1) {
      return node.value;
    }
  }

  return -1;
};

export const checkIfPlayerWon = (player: Player) => {
  let otherPlayerMarbles = 0;
  let neutralMarbles = 0;

  for (const marble of player.marblesWon) {
    if (marble !== player.marbleColor) {
      if (marble === 3) {
        neutralMarbles ++;
      } else {
        otherPlayerMarbles ++;
      }
    }
  }

  return neutralMarbles === 7 || otherPlayerMarbles === 8;
};

export const setGameStateOnDirectionSelected = (
  gameState: GameState,
  direction: string
): void => {
  gameState.directionSelected = direction;
  gameState.graph = moveMarble(gameState);

  const marbleWon = marbleWonByPlayer(gameState.graph);
  sanitizeGraph(gameState.graph);

  if (marbleWon > -1) {
    gameState.currentPlayer.marblesWon.push(marbleWon);
    if (checkIfPlayerWon(gameState.currentPlayer)) {
      gameState.hasWinner = true;
    }
    return;
  }
  gameState.currentPlayer = switchToNextPlayer(
    gameState.currentPlayer,
    gameState.players
  );
};
