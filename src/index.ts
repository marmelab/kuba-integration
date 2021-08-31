import { getInitialBoard, canMoveMarbleInDirection } from './Board'
import { boardToGraph } from './Graph'
//import { renderBoard, render } from './RenderBoard'

let firstBoard = getInitialBoard();
//let graphicalBoard = renderBoard(firstBoard)

//render(graphicalBoard);


let firstGraph = boardToGraph(firstBoard)

let isAnAuthorizedMove = canMoveMarbleInDirection(firstGraph, '0,0', 'S')
console.log(isAnAuthorizedMove);

let isAnAuthorizedMove2 = canMoveMarbleInDirection(firstGraph, '0,0', 'N')
console.log(isAnAuthorizedMove2)