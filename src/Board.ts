import { Graph, Node } from "./Types";
export type Board = Array<Array<number>>;

type deriv = {
  x: number;
  y: number;
};

type direction = {
  [direction: string]: deriv;
};

const DIRECTIONS: direction = {
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

  const DERIVATION: deriv = DIRECTIONS[direction];

  hIndex += DERIVATION.x;
  vIndex += DERIVATION.y;

  if (!positionExistsInBoard(boardGraph, `${hIndex},${vIndex}`)) return true;

  return false;
}
