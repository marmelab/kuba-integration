import { Player, Board, UserMove, Graph } from "./types";
import {
  renderToConsole,
  renderBoard,
  marbleValuetoANSIColorCode,
} from "./renderBoard";
import { askUserMove, close } from "./userInput";
import { moveMarble } from "./board";
import { graphToBoard, sanitizeGraph, boardToGraph } from "./graph";
import { MARBLE_INT_COLORS } from "./constants";

const blessed = require('blessed');

export const startNewGame = async (initialBoard: Board) => {
  let board = initialBoard;

  let players: Array<Player> = initializePlayers();

  let thisTurnPlayer: Player = players[0];

  let gameOver: Boolean = false;

  // Create a screen object.
  const screen = blessed.screen({
    smartCSR: true
  });

  const outerBox = blessed.box({
    parent: screen,
    top: 'center',
    width: '50%',
    height: '100%',
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      border: {
        fg: '#f0f0f0'
      },
    }
  });

  // Append our box to the screen.
  screen.append(outerBox);

  // render graph
  const graph = boardToGraph(board);
  const nodes = Object.values(graph.nodes);
  nodes.filter(n => n.value !== -1).forEach(node => {
    const marbleBox = blessed.box({
      top: `${node.y * 10}%`,
      left: `${node.x * 15}%`,
      width: 2,
      height: 2,
      content: node.value === 0 ? '' : '\u2022',
      style: {
        fg: MARBLE_INT_COLORS[node.value],
      }
    });

    // If our box is clicked, change the content.
    marbleBox.on('click', function (data: any) {});

    outerBox.append(marbleBox);
  });

  // Render the screen.
  screen.render();


  // while (!gameOver) {
  //   const graphicalBoard = renderBoard(board);
  //   renderToConsole(graphicalBoard, thisTurnPlayer);
  //   renderScoreBoard(players);
  //   let graphs: Array<Graph>;

  //   try {
  //     let userMove: UserMove = await askUserMove();
  //     graphs = moveMarble(board, userMove, thisTurnPlayer);
  //   } catch {
  //     continue;
  //   }

  //   const marbleWon = marbleWonByPlayer(graphs[1]);
  //   sanitizeGraph(graphs[1]);
  //   board = graphToBoard(graphs[1]);

  //   if (marbleWon > -1) {
  //     thisTurnPlayer.marblesWon.push(marbleWon);
  //     renderClear();
  //     if (checkIfPlayerWon(thisTurnPlayer)) {
  //       renderScoreBoard(players);
  //       renderWinnerScreen(thisTurnPlayer);
  //       break;
  //     }
  //     continue;
  //   }

  //   thisTurnPlayer = switchToNextPlayer(thisTurnPlayer, players);
  //   renderClear();
  // }
  // close();
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

export const renderScoreBoard = (players: Player[]): void => {
  console.log("----------------");
  console.log("Scoreboard");
  for (const player of players) {
    let playerScore = `Player ${player.playerNumber} :`;
    for (const marble of player.marblesWon) {
      playerScore += marbleValuetoANSIColorCode(marble) + " ";
    }

    console.log(playerScore);
  }
  console.log("----------------");
};

export const checkIfPlayerWon = (player: Player) => {
  return player.marblesWon.length === 7;
};

export const renderWinnerScreen = (player: Player): void => {
  console.log("\n\n----------------");
  console.log("----------------");

  console.log(
    `\n\nCongratulations, the player ${player.playerNumber} has won the Kuba game`
  );

  console.log("\n\n----------------");
  console.log("----------------");
};

const renderClear = (): void => {
  console.clear();
};
