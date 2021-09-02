import { Board, Player } from "./types";

import { MARBLE_COLORS, ALPHABET, MARBLE_INT_COLORS } from "./constants";

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
