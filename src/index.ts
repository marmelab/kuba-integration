import { getInitialBoard } from './Board'
import { renderBoard, render } from './RenderBoard'

let firstBoard = getInitialBoard();
let graphicalBoard = renderBoard(firstBoard)

render(graphicalBoard);
