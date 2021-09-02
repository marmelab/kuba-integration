import { getBoard, moveMarble } from "./board";
import { renderBoard, renderToConsole } from "./renderBoard";
import { askWhichBoard, askUserMove } from "./userInput";
import { close } from "./userInput";
import { UserMove } from "./types";
import { startNewGame } from "./game";

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
