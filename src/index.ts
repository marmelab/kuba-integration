import { getBoard, moveMarble } from "./board";
import { askWhichBoard } from "./userInput";
import { close } from "./userInput";
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
