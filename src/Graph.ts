import { Graph, Board, Edge, Node } from "./Types";

export function boardToGraph(board: Board): Graph {
  if (board.length < 1) return newBlankGraph();

  const verticalLines: number = board.length;
  const horizontalLines: number = board[0].length;

  for (let hIndex = 0; hIndex < horizontalLines; hIndex++) {
    for (let vIndex = 0; vIndex < verticalLines; vIndex++) {
      let graph: Graph = newBlankGraph();
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

function isAnExit(board: Board, x: number, y: number) {
  const firstColumnIndex: number = 0;
  const firstRowIndex: number = 0;
  const lastColumnIndex: number = board[0].length - 1;
  const lastRowIndex: number = board.length - 1;

  return (
    x === firstColumnIndex ||
    y === firstRowIndex ||
    x === lastColumnIndex ||
    y === lastRowIndex
  );
}
