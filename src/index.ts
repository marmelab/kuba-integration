import { getBoard, getBoardFromFile } from "./board";
import { askWhichBoard } from "./userInput";
import { close } from "./userInput";
import { startNewGame } from "./game";

async function main() {
  let board;
  if (process.argv.slice(2).length > 0) {
    board = getBoardFromFile(process.argv.slice(2)[0]);
  } else {
    const wichBoard = await askWhichBoard();
    board = await getBoard(wichBoard);
  }
  
  if (!board || !board.length) {
    close();
    return;
  }

  startNewGame(board);
}

main();
