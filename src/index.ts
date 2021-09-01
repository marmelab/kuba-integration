import { getBoard } from "./Board";
import { startNewGame } from "./game";
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

  startNewGame(board);
}
main();
