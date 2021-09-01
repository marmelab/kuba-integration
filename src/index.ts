import { getInitialBoard, canMoveMarbleInDirection } from "./Board";
import { renderBoard, renderToConsole } from "./RenderBoard";
import { boardToGraph } from "./Graph";
import { Graph, Board } from "./Types";

const firstBoard: Board = getInitialBoard();
const graphicalBoard = renderBoard(firstBoard);

renderToConsole(graphicalBoard);

let graph: Graph = boardToGraph(firstBoard);
if (graph) {
  let newMove = canMoveMarbleInDirection(graph, "0,0", "E");
  console.log(
    `the move from 0,0 in the south direction is authorized ? `,
    newMove
  );
  let newMove2 = canMoveMarbleInDirection(graph, "1,0", "E");
  console.log(
    `the move from 0,0 in the North direction is authorized ? `,
    newMove2
  );
}
