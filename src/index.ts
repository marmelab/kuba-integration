import { getInitialBoard } from './Board'
import { buildGraphicalBoard, render } from './VisualBoard'

let firstBoard = getInitialBoard();
let graphicalBoard = buildGraphicalBoard(firstBoard)
render(graphicalBoard);
