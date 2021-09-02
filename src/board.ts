import {
  Graph,
  Node,
  Board,
  DirectionInBoard,
  Derivation,
  Direction,
  Player,
  UserMove,
} from "./types";
import { readFileSync } from "fs";
import { askUserBoardPath } from "./userInput";

import {
  positionToCoordinate,
  boardToGraph,
  moveMarbleInDirection,
  graphToBoard,
} from "./graph";
import { renderToConsole, renderBoard } from "./renderBoard";

const DIRECTIONS: DirectionInBoard = {
  E: {
    x: 1,
    y: 0,
  },
  S: {
    x: 0,
    y: 1,
  },
  W: {
    x: -1,
    y: 0,
  },
  N: {
    x: 0,
    y: -1,
  },
};

const INVERSE_DIRECTION: DirectionInBoard = {
  E: {
    x: -1,
    y: 0,
  },
  S: {
    x: 0,
    y: -1,
  },
  W: {
    x: 1,
    y: 0,
  },
  N: {
    x: 0,
    y: 1,
  },
};

export const INITIAL_BOARD: Board = [
  [1, 1, 0, 0, 0, 2, 2],
  [1, 1, 0, 3, 0, 2, 2],
  [0, 0, 3, 3, 3, 0, 0],
  [0, 3, 3, 3, 3, 3, 0],
  [0, 0, 3, 3, 3, 0, 0],
  [2, 2, 0, 3, 0, 1, 1],
  [2, 2, 0, 0, 0, 1, 1],
];

enum Mode {
  initial = "1",
  custom = "2",
}

export async function getBoard(mode: string): Promise<Board> {
  if (mode === Mode.initial) {
    return getInitialBoard();
  }

  const boardPath = await askUserBoardPath();
  return getBoardFromFile(boardPath);
}

export function getBoardFromFile(customPath: string): Board {
  try {
    const data = readFileSync(customPath, { encoding: "utf8" });
    return JSON.parse(data).board;
  } catch (err) {
    return [];
  }
}

export function getInitialBoard(): Board {
  return INITIAL_BOARD;
}

export function canMoveMarbleInDirection(
  boardGraph: Graph,
  marblePosition: string,
  direction: string,
  player: Player
): Boolean {
  const marbleColor = boardGraph.nodes[marblePosition].value;
  return (
    positionExistsInBoard(boardGraph, marblePosition) &&
    hasFreeSpotBeforeToMove(boardGraph, marblePosition, direction) &&
    isOfMyMarbleColor(player, marbleColor)
  );
}

function positionExistsInBoard(
  boardGraph: Graph,
  marblePosition: string
): Boolean {
  return !!boardGraph.nodes[marblePosition];
}

function hasFreeSpotBeforeToMove(
  boardGraph: Graph,
  marblePosition: string,
  direction: string
): Boolean {
  const basePosition: Node = boardGraph.nodes[marblePosition];

  let hIndex: number = basePosition.x;
  let vIndex: number = basePosition.y;

  const DERIVATION: Derivation = INVERSE_DIRECTION[direction];

  hIndex += DERIVATION.x;
  vIndex += DERIVATION.y;

  return !positionExistsInBoard(boardGraph, `${hIndex},${vIndex}`);
}

function isOfMyMarbleColor(player: Player, marbleColor: number) {
  return player.marbleColor === marbleColor;
}

//TODO: Add Player to args
export function moveMarble(board: Board, userMove: UserMove): void {
  const coordinate = positionToCoordinate(userMove.marblePosition);
  const stringCoordinate = `${coordinate.y},${coordinate.x}`;
  const boardGraph = boardToGraph(board);
  const canMove = canMoveMarbleInDirection(
    boardGraph,
    stringCoordinate,
    userMove.marbleDirection
  );

  if (!canMove) {
    console.log("This movement is not possible");
  }

  const movedGraph = moveMarbleInDirection(
    boardGraph,
    coordinate,
    userMove.direction
  );

  const newBoard = graphToBoard(movedGraph);
  const graphicalBoard = renderBoard(newBoard);
  renderToConsole(graphicalBoard); //TODO: Add player in parameters
}
