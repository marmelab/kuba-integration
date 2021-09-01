import { Graph, Node, Board, DirectionInBoard, Derivation } from "./Types";

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

export function getInitialBoard(): Board {
  return [
    [1, 1, 0, 0, 0, 2, 2],
    [1, 1, 0, 3, 0, 2, 2],
    [0, 0, 3, 3, 3, 0, 0],
    [0, 3, 3, 3, 3, 3, 0],
    [0, 0, 3, 3, 3, 0, 0],
    [2, 2, 0, 3, 0, 1, 1],
    [2, 2, 0, 0, 0, 1, 1],
  ];
}

export function canMoveMarbleInDirection(
  boardGraph: Graph,
  marblePosition: string,
  direction: string
): Boolean {
  if (positionExistsInBoard(boardGraph, marblePosition)) {
    if (hasFreeSpotBeforeToMove(boardGraph, marblePosition, direction))
      return true;
  }

  return false;
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
