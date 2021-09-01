import { getBoard } from "./Board";
import { renderBoard, renderToConsole } from "./RenderBoard";
import { askWhichBoard, askUserMove } from "./UserInput";
import { close } from "./UserInput";

async function main() {
  const wichBoard = await askWhichBoard();
  const board = await getBoard(wichBoard);

  if (!board || !board.length) {
    close();
    return;
  }
  const graphicalBoard = renderBoard(board);
  renderToConsole(graphicalBoard);
  askUserMove();
}

main();
