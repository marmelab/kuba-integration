/**
 * Transform an array into graph
 */

/**
 * TYPES
 */

export type Node = {
  x: number;
  y: number;
  value: number;
  isExit: Boolean;
};

export type Edge = {
  from: string;
  to: string;
  direction: string;
};

export type Graph = {
  nodes: {
    [coordinates: string]: Node;
  };
  edges: Array<Edge>;
};

/**
 * FUNCTIONS
 */

export function boardToGraph(board: Array<Array<number>>): Graph | undefined {

  if (board.length < 1) return undefined;

  let graphFromBoard: Graph = newBlankGraph();


  const verticalLines: number = board.length;
    const horizontalLines: number = board[0].length;
  

    for (let hIndex = 0; hIndex < horizontalLines; hIndex++){
        for (let vIndex = 0; vIndex < verticalLines; vIndex++){

            graphFromBoard = addBoardBoundaries(graphFromBoard, board, hIndex, vIndex)
            graphFromBoard = addDirections(graphFromBoard, board, hIndex, vIndex)

        }
    }

  return graphFromBoard;

}

function newBlankGraph(): Graph {
  return {
    nodes: {},
    edges: [],
  };
}

function addBoardBoundaries(graph: Graph, board: Array<Array<number>>, hIndex: number, vIndex: number): Graph {

    graph.nodes[`${hIndex},${vIndex}`] = {
        x: hIndex,
        y: vIndex,
        value: board[vIndex][hIndex],
        isExit: isAnExit(board, hIndex, vIndex)
    }

  return graph;
}

function addDirections(graph: Graph, board: Array<Array<number>>, hIndex: number, vIndex: number): Graph {

    graph.edges.push({
        from: `${hIndex},${vIndex}`,
        to: `${hIndex-1},${vIndex}`,
        direction: 'W'
    })

    graph.edges.push({
        from: `${hIndex},${vIndex}`,
        to: `${hIndex+1},${vIndex}`,
        direction: 'E'
    })

    graph.edges.push({
        from: `${hIndex},${vIndex}`,
        to: `${hIndex},${vIndex-1}`,
        direction: 'N'
    })

    graph.edges.push({
        from: `${hIndex},${vIndex}`,
        to: `${hIndex},${vIndex+1}`,
        direction: 'S'
    })

  return graph;
}

function isAnExit(board: Array<Array<number>>, x: number, y: number){
    const firstColumnIndex: number = 0;
    const firstRowIndex: number = 0;
    const lastColumnIndex: number = board[0].length - 1;
    const lastRowIndex: number = board.length - 1;

    if (x === firstColumnIndex) return true
    if (y === firstRowIndex) return true
    if (x === lastColumnIndex) return true
    if (y === lastRowIndex) return true

    return false
}

/*

TODO: Check user move
this implies : 
    - register players and colors of players
    - register last move
    - checking the marble color of user
    - check is move is not a revert of last one


TODO: To be removed

obviously all the 0:x and x:0 are exits
        all board[x, length] and board[length, x] are exits
        the only admitted directions are N, E, S, W

directions : 
    x-1 == 'West'
    x+1 == 'East'
    y-1 == 'North'
    y+1 == 'South'

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
