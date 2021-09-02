import { Board, Player } from "./Types";

export const RED_MARBLE: string = `\u001b[31m \u2022 \u001b[0m`;
export const BLUE_MARBLE: string = `\u001b[34m \u2022 \u001b[0m`;
export const WHITE_MARBLE: string = `\u001b[37m \u2022 \u001b[0m`;
export const EMPTY_MARBLE: string = `   `;
const MARBLE_COLORS = [EMPTY_MARBLE, RED_MARBLE, BLUE_MARBLE, WHITE_MARBLE];

export const ALPHABET: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MARBLE_INT_COLORS: string[] = ["empty", "red", "blue", "white"];

export function renderBoard(board: Board): string {
  const columnLetters = ALPHABET.substr(0, board[0].length);
  const header = columnLetters.split("").map((char) => ` ${char} `);
  const firstLine = "   " + header.join("");

  let result = firstLine + "\n";

  for (let i = 0; i < board.length; i++) {
    let line = ` ${i} `;
    for (const marble of board[i]) {
      line += marbleValuetoANSIColorCode(marble);
    }
    result += line + "\n";
  }

  return result;
}

function marbleValuetoANSIColorCode(marble: number): string {
  return MARBLE_COLORS[marble];
}

export function renderToConsole(graphicalBoard: string, player: Player) {
  console.log(
    ` \n player ${player.playerNumber} (${
      MARBLE_INT_COLORS[player.marbleColor]
    } marbles) turn to play`
  );
  console.log(graphicalBoard);
}
