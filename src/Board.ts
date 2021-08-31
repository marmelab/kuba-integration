import { readFileSync } from "fs";
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

export async function getBoard(mode: string): Promise<Board> {
  if (mode === "1") {
    return getInitialBoard();
  }

  const boardPath = await askUserBoardPath();
  return getBoardFromFile(boardPath);
}

export function getBoardFromFile(customPath: string): Board {
  let board;

  try {
    const data = readFileSync(customPath, { encoding: "utf8" });
    board = JSON.parse(data).board;
    return board;
  } catch (err) {
    return [];
  }
}

export function getInitialBoard(): Board {
  return INITIAL_BOARD;
}
