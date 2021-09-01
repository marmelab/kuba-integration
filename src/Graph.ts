import { Graph, Board, Edge, Node } from "./Types";
import { ALPHABET } from "./RenderBoard";

const VALUE_DIRECTION = [];
VALUE_DIRECTION["W"] = -1;
VALUE_DIRECTION["E"] = 1;
VALUE_DIRECTION["N"] = -1;
VALUE_DIRECTION["S"] = -1;

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
    return undefined;
  }

  const positionSplit = position.split("");

  const x = ALPHABET.indexOf(positionSplit[0]);
  const y = parseInt(positionSplit[1] + positionSplit[2]);

  if (!x || x === -1 || !y) {
    return undefined;
  }

  return { x, y };
}

function nextCoordinateFromDirection(
  coordinate: { x: number; y: number },
  direction: string
): { x: number; y: number } {
  if (!coordinate || !direction) {
    return undefined;
  }

  if (direction == "W" || direction == "E") {
    return { x: coordinate.x + VALUE_DIRECTION[direction], y: coordinate.y };
  }

  return { x: coordinate.x, y: coordinate.y + VALUE_DIRECTION[direction] };
}

export function moveMarbleInDirection(
  graph: Graph,
  marbleCoordinate: { x: number; y: number },
  direction: string
): Graph {
  if (!marbleCoordinate || !graph || !direction) {
    return undefined;
  }

  const firstNode = graph.nodes[`${marbleCoordinate.x},${marbleCoordinate.y}`];
  let previousNodeValue = firstNode.value;
  firstNode.value = 0;

  let nextCoordinate = nextCoordinateFromDirection(marbleCoordinate, direction);

  while (graph.nodes[`${nextCoordinate.x},${nextCoordinate.y}`]) {
    const node = graph.nodes[`${nextCoordinate.x},${nextCoordinate.y}`];
    const tmpValue = node.value;
    node.value = previousNodeValue;
    previousNodeValue = tmpValue;

    if (tmpValue === 0) {
      break;
    }

    nextCoordinate = nextCoordinateFromDirection(nextCoordinate, direction);
  }

  return graph;
}
