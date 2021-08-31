const fs = require("fs");
import { askUserBoardPath } from "./UserInput";

export type Board = Array<Array<number>>;
export const INITIAL_BOARD: Board = [
  [1, 1, 0, 0, 0, 2, 2],
  [1, 1, 0, 3, 0, 2, 2],
  [0, 0, 3, 3, 3, 0, 0],
  [0, 3, 3, 3, 3, 3, 0],
  [0, 0, 3, 3, 3, 0, 0],
  [2, 2, 0, 3, 0, 1, 1],
  [2, 2, 0, 0, 0, 1, 1],
];

export async function getBoard(mode: String): Promise<Board> {
  let board;
  if (mode === "1") {
    board = getInitialBoard();
  } else {
    const boardPath = await askUserBoardPath();
    board = await getBoardFromFile(boardPath);
  }

  return board;
}

export async function getBoardFromFile(customPath: String): Promise<Board> {
  let board;

  try {
    const data: string = await new Promise((resolve) => {
      fs.readFile(customPath, "utf8", (err: string, data: string) => {
        if (err) {
          resolve(data);
        }
        resolve(data);
      });
    });

    board = JSON.parse(data).board;
    return board;
  } catch (err) {
    return [];
  }
}

export function getInitialBoard(): Board {
  return INITIAL_BOARD;
}
