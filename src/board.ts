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

import { INVERSE_DIRECTION, INITIAL_BOARD } from "./constants";

import { CantMoveError } from "./error";

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

export function checkMoveMarbleInDirection(
  boardGraph: Graph,
  marblePosition: string,
  direction: string,
  player: Player
): void {
  const existInBoard = positionExistsInBoard(boardGraph, marblePosition);
  if (!existInBoard) {
    throw new CantMoveError("This position does not exist in the board");
  }

  const freeSpotBeforeToMove = hasFreeSpotBeforeToMove(
    boardGraph,
    marblePosition,
    direction
  );
  if (!freeSpotBeforeToMove) {
    throw new CantMoveError("No free space before the marble");
  }

  const marbleColor = boardGraph.nodes[marblePosition].value;
  if (!marbleColor) {
    throw new Error(
      "No value"
    );
  }

  const myMarbleColor = isOfMyMarbleColor(player, marbleColor);

  if (!myMarbleColor) {
    throw new CantMoveError(
      "This marble can't be moved because it is not your color"
    );
  }
}

function positionExistsInBoard(
  boardGraph: Graph,
  marblePosition: string
): Boolean {
  let node = boardGraph.nodes[marblePosition];
  if (node) return node.value >= 1;
  return !!node;
}

function hasFreeSpotBeforeToMove(
  boardGraph: Graph,
  marblePosition: string,
  direction: string
): Boolean {
  const basePosition: Node = boardGraph.nodes[marblePosition];

  let hIndex: number = basePosition.x;
  let vIndex: number = basePosition.y;

  const derivation: Derivation = INVERSE_DIRECTION[direction];

  hIndex += derivation.x;
  vIndex += derivation.y;

  return !positionExistsInBoard(boardGraph, `${hIndex},${vIndex}`);
}

function isOfMyMarbleColor(player: Player, marbleColor: number) {
  return player.marbleColor === marbleColor;
}

export function moveMarble(
  board: Board,
  userMove: UserMove,
  player: Player
): Array<Graph> {
  const coordinate = positionToCoordinate(userMove.marblePosition);
  const stringCoordinate = `${coordinate.x},${coordinate.y}`;
  console.log(board);
  const boardGraph = boardToGraph(board);
  console.log(boardGraph);
  const canMove = checkMoveMarbleInDirection(
    boardGraph,
    stringCoordinate,
    userMove.direction,
    player
  );

  const movedGraph = moveMarbleInDirection(
    boardGraph,
    coordinate,
    userMove.direction
  );

  return [boardGraph, movedGraph];
}
