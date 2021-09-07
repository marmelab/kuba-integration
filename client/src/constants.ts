import { DirectionInBoard, Board } from "./types";

export const INVERSE_DIRECTION: DirectionInBoard = {
  E: {
    x: -1,
    y: 0,
  },
  S: {
    x: 0,
    y: -1,
  },
  W: {
    x: 1,
    y: 0,
  },
  N: {
    x: 0,
    y: 1,
  },
};

export const INITIAL_BOARD: Board = [
  [1, 1, 0, 0, 0, 2, 2],
  [1, 1, 0, 3, 0, 2, 2],
  [0, 0, 3, 3, 3, 0, 0],
  [0, 3, 3, 3, 3, 3, 0],
  [0, 0, 3, 3, 3, 0, 0],
  [2, 2, 0, 3, 0, 1, 1],
  [2, 2, 0, 0, 0, 1, 1],
];

export const RED_MARBLE: string = `\u001b[31m \u2022 \u001b[0m`;
export const BLUE_MARBLE: string = `\u001b[34m \u2022 \u001b[0m`;
export const WHITE_MARBLE: string = `\u001b[37m \u2022 \u001b[0m`;
export const EMPTY_MARBLE: string = `   `;
export const MARBLE_COLORS = [
  EMPTY_MARBLE,
  RED_MARBLE,
  BLUE_MARBLE,
  WHITE_MARBLE,
];

export const ALPHABET: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const MARBLE_INT_COLORS: string[] = [
  "transparent",
  "red",
  "blue",
  "white",
];


// export const URL: string = "http://192.168.86.189:3000";
export const URL: string = "localhost:3000";