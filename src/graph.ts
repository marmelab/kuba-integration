import { Graph, Board, Edge, Node } from "./types";
import { ALPHABET } from "./constants";
import { UserPositionError } from "./error";

export function boardToGraph(board: Board): Graph {
  if (board.length < 1) return newBlankGraph();

  const verticalLines: number = board.length;
  const horizontalLines: number = board[0].length;


  let graph: Graph = newBlankGraph();

  for (let hIndex = -1; hIndex < horizontalLines + 1; hIndex++) {
    for (let vIndex = -1; vIndex < verticalLines + 1; vIndex++) {
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
  value: isAnExit(board, hIndex, vIndex) ? -1 : board[vIndex][hIndex],
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
  const beforeFirstColumnIndex: number = -1;
  const beforeFirstRowIndex: number = -1;
  const afterLastColumnIndex: number = board[0].length;
  const afterLastRowIndex: number = board.length;

  return (
    x === beforeFirstColumnIndex ||
    y === beforeFirstRowIndex ||
    x === afterLastColumnIndex ||
    y === afterLastRowIndex
  );
}

export function positionToCoordinate(position: string): {
  x: number;
  y: number;
} {
  if (position.length > 3) {
    throw new UserPositionError("This position is longer than 3 characters");
  }

  const positionSplit = position.split("");

  const x = ALPHABET.indexOf(positionSplit[0]);
  const y = parseInt(positionSplit[1] + positionSplit[2]);

  if (x === -1 || y < 0) {
    throw new UserPositionError("This position is not well formatted");
  }

  return { x, y };
}

export function moveMarbleInDirection(
  graph: Graph,
  marbleCoordinate: { x: number; y: number },
  direction: string
): Graph {
  if (!marbleCoordinate || !graph || !direction) {
    return {
      nodes: {},
      edges: [],
    };
  }

  let currentNode = graph.nodes[`${marbleCoordinate.x},${marbleCoordinate.y}`];

  if (currentNode.value === 0) {
    return graph;
  }

  const nodes = [currentNode];
  while (true) {
    const edge = graph.edges.find((edge) => {
      return (
        edge.direction === direction &&
        edge.from === `${currentNode.x},${currentNode.y}`
      );
    });

    if (!edge || !graph.nodes[edge.to]) {
      break;
    }

    currentNode = graph.nodes[edge.to];
    nodes.push(currentNode);

    if (currentNode.value == 0) {
      break;
    }
  }

  let previousValue = 0;
  nodes.map((node) => {
    const tmpValue = node.value;
    node.value = previousValue;
    previousValue = tmpValue;
  });

  return graph;
}
export const graphToBoard = (graph: Graph): Board => {
  const board: Board = [[]];
  for (const index in graph.nodes) {
    const node: Node = graph.nodes[index];
    if (node.value >= 0) {
      if (!board[node.y]) {
        board.push([]);
      }
      board[node.y][node.x] = node.value;
    }
  }
  return board;
};

export const sanitizeGraph = (graph: Graph) => {
  for (const node of Object.values(graph.nodes)) {
    if (node.isExit && node.value > -1) {
      node.value = -1;
    }
  }
}