import { Direction, UserMove } from "./Types";

const readline = require("readline");

// The readline module provides an interface for reading data from a Readable stream (such as process.stdin) one line at a time.
// This is used to manage the communication between our player and the application
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function askWhichBoard(): Promise<string> {
  return new Promise((resolve) => {
    rl.question("Type 1 for initial board or 2 for custom board ", resolve);
  });
}

export function askUserBoardPath(): Promise<string> {
  return new Promise((resolve) => {
    rl.question("Path ", resolve);
  });
}

export async function askUserMove(): Promise<UserMove> {
  const marblePosition = await marble();
  const marbleDirection = await direction();
  close();
  const userMove: UserMove = {
    marblePosition: marblePosition,
    direction: marbleDirection,
  };
  return userMove;
}

function marble(): Promise<string> {
  return new Promise((resolve) => {
    rl.question("Marble (e.g B2) ", resolve);
  });
}

function direction(): Promise<Direction> {
  return new Promise((resolve) => {
    rl.question("Direction (e.g W) ", resolve);
  });
}

export function close(): void {
  rl.close();
}
