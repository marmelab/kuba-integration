import { Player, Board, UserMove, Graph } from "./types";
import { renderToConsole, renderBoard } from "./renderBoard";
import { askUserMove, close } from "./userInput";
import { moveMarble } from "./board";
import { graphToBoard } from "./graph";

export const startNewGame = async (initialBoard: Board) => {
  let board = initialBoard;

  let players: Array<Player> = initializePlayers();

  let thisTurnPlayer: Player = players[0];

  let gameOver: Boolean = false;

  while (!gameOver) {
    const graphicalBoard = renderBoard(board);
    renderToConsole(graphicalBoard, thisTurnPlayer);
    let graphs: Array<Graph>;

    try {
      let userMove: UserMove = await askUserMove();
      graphs = moveMarble(board, userMove, thisTurnPlayer);
    } catch {
      continue;
    }

    board = graphToBoard(graphs[1]);

    thisTurnPlayer = switchToNextPlayer(thisTurnPlayer, players);
  }
  close();
};

const initializePlayers = () => {
  const player1: Player = {
    playerNumber: 1,
    marbleColor: 1,
  };

  const player2: Player = {
    playerNumber: 2,
    marbleColor: 2,
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
