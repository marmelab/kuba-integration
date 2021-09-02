import { getBoard, moveMarble } from "./Board";
import { renderBoard, renderToConsole } from "./RenderBoard";
import { askWhichBoard, askUserMove } from "./UserInput";
import { close } from "./UserInput";
import { UserMove } from './Types'

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
