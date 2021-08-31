import { Board } from "./Board";
import { Node, Edge, Graph } from "./Types";

export function boardToGraph(board: Board): Graph {
  if (board.length < 1) return newBlankGraph();

  let graphFromBoard: Graph = newBlankGraph();

  const verticalLines: number = board.length;
  const horizontalLines: number = board[0].length;

  for (let hIndex = 0; hIndex < horizontalLines; hIndex++) {
    for (let vIndex = 0; vIndex < verticalLines; vIndex++) {
      graphFromBoard = fillNodes(graphFromBoard, board, hIndex, vIndex);
      graphFromBoard = addDirections(graphFromBoard, board, hIndex, vIndex);
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

function addDirections(
  graph: Graph,
  board: Board,
  hIndex: number,
  vIndex: number
): Graph {
  graph.edges.push({
    from: `${hIndex},${vIndex}`,
    to: `${hIndex - 1},${vIndex}`,
    direction: "W",
  });

  graph.edges.push({
    from: `${hIndex},${vIndex}`,
    to: `${hIndex + 1},${vIndex}`,
    direction: "E",
  });

  graph.edges.push({
    from: `${hIndex},${vIndex}`,
    to: `${hIndex},${vIndex - 1}`,
    direction: "N",
  });

  graph.edges.push({
    from: `${hIndex},${vIndex}`,
    to: `${hIndex},${vIndex + 1}`,
    direction: "S",
  });

  return graph;
}

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
