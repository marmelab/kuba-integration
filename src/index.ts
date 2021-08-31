import { getInitialBoard } from './Board'
import { renderBoard, renderToConsole } from './RenderBoard'

const firstBoard = getInitialBoard();
const graphicalBoard = renderBoard(firstBoard)

renderToConsole(graphicalBoard);
