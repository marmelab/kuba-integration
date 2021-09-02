// initialize a game with standard/custom board
// affect marbles color to player
// store player turns
// Change player after a move
// except when the previous move exists a marble.

import { Player, Board } from "./types";
import { renderToConsole, renderBoard } from "./renderBoard";
import { askUserMove } from "./userInput";

export const startNewGame = (board: Board) => {
  let players: Array<Player> = [];

  const player1: Player = {
    playerNumber: 1,
    marbleColor: 1,
  };

  const player2: Player = {
    playerNumber: 2,
    marbleColor: 2,
  };

  players = [player1, player2];

  let thisTurnPlayer: Player = player1;

  while (true) {
    const graphicalBoard = renderBoard(board);
    renderToConsole(graphicalBoard, thisTurnPlayer);
    askUserMove();

    thisTurnPlayer = switchToNextPlayer(player1, players);
  }
};

export const switchToNextPlayer = (
  actualPlayer: Player,
  players: Array<Player>
): Player => {
  let nextPlayerIndex = players.indexOf(actualPlayer) + 1;

  if (nextPlayerIndex > players.length - 1) return players[0];
  return players[nextPlayerIndex];
};
