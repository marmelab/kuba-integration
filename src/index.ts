import { getBoard, moveMarble } from "./board";
import { renderBoard, renderToConsole } from "./renderBoard";
import { askWhichBoard, askUserMove } from "./userInput";
import { close } from "./userInput";
import { UserMove } from './types'

async function main() {
  const wichBoard = await askWhichBoard();
  const board = await getBoard(wichBoard);

  if (!board || !board.length) {
    close();
    return;
  }
  const graphicalBoard = renderBoard(board);
  renderToConsole(graphicalBoard); //TODO: Add player to params
  const userMove: UserMove = await askUserMove();
  moveMarble(board, userMove)
}

  startNewGame(board);
}
main();
