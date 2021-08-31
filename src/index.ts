import { getInitialBoard } from './Board'
import { boardToGraph } from './Graph'
//import { renderBoard, render } from './RenderBoard'

let firstBoard = getInitialBoard();
//let graphicalBoard = renderBoard(firstBoard)

//render(graphicalBoard);


let firstGraph = boardToGraph(firstBoard)

console.log(firstGraph) //TODO: Basic test, to be removed !