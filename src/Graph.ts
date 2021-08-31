/**
 * Transform array to graph
 */

/**
 * TYPES
 */

type node = {
  x: number;
  y: number;
  value: number;
  isExit: Boolean;
};

type edge = {
  from: string;
  to: string;
  direction: string;
};

type Graph = {
  nodes: {
    [coordinates: string]: node;
  };
  edges: Array<edge>;
};

/**
 * FUNCTIONS
 */

export function boardToGraph(board: Array<Array<Number>>): Graph | undefined {
  /* obviously all the 0:x and x:0 are exits
        all board[x, length] and board[length, x] are exits
        the only admitted directions are N, E, S, W
    */

  if (board.length < 1) return undefined;

  let graphFromBoard: Graph = newGraph();

  const verticvalLines: Number = board.length;
  const horizontalLines: Number = board[0].length;

  graphFromBoard = addBoardBoundaries()
}

function newGraph(): Graph {
  return {
    nodes: {},
    edges: [],
  };
}

function addBoardBoundaries(graph: Graph, horizontalLines, verticalLines): Graph {

    

  return graph;
}

function initGraphFromBoard(board: Array<Array<Number>>) {}

function addDirections(graph: Graph): Graph {
  return graph;
}

/*

const board = [
  [1, 0],
  [1, 2],
];
const graph = boardToGraph(board);

graph = {
  nodes: {
      '0,0': { x: 0, y: 0, value: 1, isExit: false },
      '0,1': { x: 0, y: 1, value: 1, isExit: false },
      '1,0': { x: 1, y: 0, value: 0, isExit: false },
      '1,1': { x: 1, y: 1, value: 2, isExit: false },
      '0,-1': { x: 0, y: -1, isExit: true },
      '1,-1': { x: 1, y: -1, isExit: true },
      '-1,0': { x: -1, y: 0, isExit: true },
      '-1,1': { x: -1, y: 1, isExit: true },
      '0,2': { x: 0, y: 2, isExit: true },
      '1,2': { x: 1, y: 2, isExit: true },
      '2,0': { x: 2, y: 0, isExit: true },
      '2,1': { x: 2, y: 1, isExit: true }
  },
  edges: [
     { from: "0,0", to: "1,0", direction: "E" },
     { from: "1,0", to: "0,0", direction: "W" },
     { from: "0,0", to: "0,1", direction: "S" },
     { from: "0,1", to: "0,0", direction: "N" },
     { from: "0,1", to: "1,1", direction: "E" },
     { from: "1,1", to: "0,1", direction: "W" },
     { from: "1,0", to: "1,1", direction: "S" },
     { from: "1,1", to: "1,0", direction: "N" },
     { from: "0,0", to: "0,-1", direction: "N" },
     { from: "1,0", to: "1,-1", direction: "N" },
     { from: "0,0", to: "-1,0", direction: "W" },
     { from: "0,1", to: "-1,1", direction: "W" },
     { from: "0,1", to: "0,2", direction: "S" },
     { from: "1,1", to: "1,2", direction: "S" },
     { from: "1,0", to: "2,0", direction: "E" },
     { from: "1,1", to: "2,1", direction: "E" },
  ]
}
*/
