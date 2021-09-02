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
  let node = boardGraph.nodes[marblePosition];
  if (node) return node.value !== 0;
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
  const stringCoordinate = `${coordinate.y},${coordinate.x}`;
  const boardGraph = boardToGraph(board);
  const canMove = canMoveMarbleInDirection(
    boardGraph,
    stringCoordinate,
    userMove.direction,
    player
  );

  if (!canMove) {
    console.log("This movement is not possible");
    return [boardGraph, boardGraph];
  }

  const movedGraph = moveMarbleInDirection(
    boardGraph,
    coordinate,
    userMove.direction
  );

  return [boardGraph, movedGraph];
}
