import { getInitialBoard } from './Board'
import { renderBoard, renderToConsole } from './RenderBoard'
import { askUserBoard, askUserMove } from './UserInput'



async function main() {
    const customPath = await askUserBoard();
    const firstBoard = await getInitialBoard(customPath);
    const graphicalBoard = renderBoard(firstBoard);

    renderToConsole(graphicalBoard);
    askUserMove();
}

main();