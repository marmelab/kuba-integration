import { Graph, Board, Edge, Node } from "./Types";
import { ALPHABET } from "./RenderBoard";

export function boardToGraph(board: Board): Graph {
  if (board.length < 1) return newBlankGraph();

  const verticalLines: number = board.length;
  const horizontalLines: number = board[0].length;

  let graph: Graph = newBlankGraph();

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

export function positionToCoordinate(position: string): {
  x: number;
  y: number;
} {
  if (position.length > 3) {
    return { x: -1, y: -1 };
  }

  const positionSplit = position.split("");

  const x = ALPHABET.indexOf(positionSplit[0]);
  const y = parseInt(positionSplit[1] + positionSplit[2]);

  if (!x || x === -1 || !y) {
    return { x: -1, y: -1 };
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

  let currentNode = graph.nodes[`${marbleCoordinate.y},${marbleCoordinate.x}`];

  if (currentNode.value === 0) {
    return graph;
  }

  const nodes = [currentNode];
  while (true) {

    const edge = graph.edges.find((edge) => {
      return edge.direction === direction && edge.from === `${currentNode.y},${currentNode.x}`;
    });
    
    if (!edge || !graph.nodes[edge.to]) {
      break;
    };

    currentNode = graph.nodes[edge.to];
    nodes.push(currentNode);

    if (currentNode.value == 0){
      break;
    }
  }

  let previousValue = 0;
  nodes.map((node) => {
    const tmpValue = node.value;
    node.value = previousValue;
    previousValue = tmpValue;
  })

  return graph;
}
export const graphToBoard = (graph: Graph): Board => {
  const board: Board = [[]];
  for (const index in graph.nodes) {
    const node: Node = graph.nodes[index];
    if (!board[node.y]) {
      board.push([]);
    }
    board[node.y][node.x] = node.value;
  }
  return board;
};
