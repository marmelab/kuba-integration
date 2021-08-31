import { getInitialBoard } from './Board'
import { renderBoard, renderToConsole } from './RenderBoard'
import { askUserMove } from './UserInput'

const firstBoard = getInitialBoard();
const graphicalBoard = renderBoard(firstBoard);

renderToConsole(graphicalBoard);
askUserMove();
