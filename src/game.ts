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
    renderScoreBoard(players);
    let graphs: Array<Graph>;

    try {
      let userMove: UserMove = await askUserMove();
      graphs = moveMarble(board, userMove, thisTurnPlayer);
    } catch {
      continue;
    }

    board = graphToBoard(graphs[1]);
    const marbleWon = marbleWonByPlayer(graphs[1]);

    if (marbleWon) {
      thisTurnPlayer.marblesWon.push(marbleWon);
      continue;
    }

    thisTurnPlayer = switchToNextPlayer(thisTurnPlayer, players);
  }
  close();
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

export const marbleWonByPlayer = (graph:Graph): number => {
  if (!graph) {
    return null;
  }

  for (const node of Object.values(graph.nodes)) {
    if (node.isExit && node.value) {
      return node.value;
    }
  }
  
  return null;
};

export const renderScoreBoard = (): void => {
  
}
