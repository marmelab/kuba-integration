import { Graph, Board, Edge, Node } from "./Types";

export function boardToGraph(board: Board): Graph {
  if (board.length < 1) return newBlankGraph();

  let graph: Graph = newBlankGraph();

  const verticalLines: number = board.length;
  const horizontalLines: number = board[0].length;

  for (let hIndex = 0; hIndex < horizontalLines; hIndex++) {
    for (let vIndex = 0; vIndex < verticalLines; vIndex++) {
      graph = {
        nodes: {
          ...graph.nodes,
          [`${hIndex},${vIndex}`]: makeNode(hIndex, vIndex, board),
        },
        edges: [...graph.edges, ...makeEdges(hIndex, vIndex)],
      };
    }
  }

  return graph;
}

function newBlankGraph(): Graph {
  return {
    nodes: {},
    edges: [],
  };
}

const makeNode = (hIndex: number, vIndex: number, board: Board): Node => ({
  x: hIndex,
  y: vIndex,
  value: board[vIndex][hIndex],
  isExit: isAnExit(board, hIndex, vIndex),
});

const makeEdges = (hIndex: number, vIndex: number): Edge[] => [
  {
    from: `${hIndex},${vIndex}`,
    to: `${hIndex - 1},${vIndex}`,
    direction: "W",
  },
  {
    from: `${hIndex},${vIndex}`,
    to: `${hIndex + 1},${vIndex}`,
    direction: "E",
  },
  {
    from: `${hIndex},${vIndex}`,
    to: `${hIndex},${vIndex - 1}`,
    direction: "N",
  },
  {
    from: `${hIndex},${vIndex}`,
    to: `${hIndex},${vIndex + 1}`,
    direction: "S",
  },
];

/* export function boardToGraph(board: Board): Graph {
  if (board.length < 1) return newBlankGraph();

  let graph: Graph = newBlankGraph();
  let graphWithNodes: Graph = { ...graph };
  let graphWithNodesAndDirections: Graph = { ...graph };

  const verticalLines: number = board.length;
  const horizontalLines: number = board[0].length;

  for (let hIndex = 0; hIndex < horizontalLines; hIndex++) {
    for (let vIndex = 0; vIndex < verticalLines; vIndex++) {
      graphWithNodes = fillNodes(graph, board, hIndex, vIndex);
      graphWithNodesAndDirections = addDirections(
        graphWithNodes,
        hIndex,
        vIndex
      );
    }
  }

  return graphWithNodesAndDirections;
}

function newBlankGraph(): Graph {
  return {
    nodes: {},
    edges: [],
  };
}

function fillNodes(
  graph: Graph,
  board: Board,
  hIndex: number,
  vIndex: number
): Graph {
  let graphWithNodes = { ...graph };
  graphWithNodes.nodes[`${hIndex},${vIndex}`] = {
    x: hIndex,
    y: vIndex,
    value: board[vIndex][hIndex],
    isExit: isAnExit(board, hIndex, vIndex),
  };

  return graphWithNodes;
}

function addDirections(graph: Graph, hIndex: number, vIndex: number): Graph {
  let graphWithDirections = { ...graph };

  graphWithDirections.edges.push({
    from: `${hIndex},${vIndex}`,
    to: `${hIndex - 1},${vIndex}`,
    direction: "W",
  });

  graphWithDirections.edges.push({
    from: `${hIndex},${vIndex}`,
    to: `${hIndex + 1},${vIndex}`,
    direction: "E",
  });

  graphWithDirections.edges.push({
    from: `${hIndex},${vIndex}`,
    to: `${hIndex},${vIndex - 1}`,
    direction: "N",
  });

  graphWithDirections.edges.push({
    from: `${hIndex},${vIndex}`,
    to: `${hIndex},${vIndex + 1}`,
    direction: "S",
  });

  return graphWithDirections;
} */

function isAnExit(board: Board, x: number, y: number) {
  const firstColumnIndex: number = 0;
  const firstRowIndex: number = 0;
  const lastColumnIndex: number = board[0].length - 1;
  const lastRowIndex: number = board.length - 1;

  if (x === firstColumnIndex) return true;
  if (y === firstRowIndex) return true;
  if (x === lastColumnIndex) return true;
  if (y === lastRowIndex) return true;

  return false;
}
