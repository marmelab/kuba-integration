import { getInitialBoard, canMoveMarbleInDirection } from './Board'
import { renderBoard, renderToConsole } from './RenderBoard'
import { Graph, boardToGraph } from './Graph';

const firstBoard = getInitialBoard();
const graphicalBoard = renderBoard(firstBoard)

renderToConsole(graphicalBoard);

let graph: Graph = boardToGraph(firstBoard)
if (graph){

    //console.log(graph)

    let moveAuth = canMoveMarbleInDirection(graph, '0,0', 'S');
    console.log(moveAuth)
    let moveAuth2 = canMoveMarbleInDirection(graph, '0,0', 'N');
    console.log(moveAuth2)
    let moveAuth3 = canMoveMarbleInDirection(graph, '0,0', 'W');
    console.log(moveAuth3)
    let moveAuth4 = canMoveMarbleInDirection(graph, '0,0', 'E');
    console.log(moveAuth4)

}