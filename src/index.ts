import { getBoard } from "./Board";
import { renderBoard, renderToConsole } from "./RenderBoard";
import { askWhichBoard, askUserMove } from "./UserInput";

async function main() {
  const wichBoard = await askWhichBoard();
  const board = await getBoard(wichBoard);

  if (board) {
    const graphicalBoard = renderBoard(board);

    renderToConsole(graphicalBoard);
    askUserMove();
  }
}

main();
