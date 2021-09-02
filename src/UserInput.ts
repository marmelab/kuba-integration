import { Direction } from "./Types";

const readline = require("readline");

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

export async function askUserMove(): Promise<{marblePosition: string, marbleDirection: Direction}> {
  const marblePosition = await marble();
  const marbleDirection = await direction();
  return {marblePosition, marbleDirection}
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
