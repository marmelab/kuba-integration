import { Board } from './Board'

export const redMarble: String= `\u001b[31m \u2022 \u001b[0m`;
export const blueMarble: String = `\u001b[34m \u2022 \u001b[0m`;
export const whiteMarble: String = `\u001b[37m \u2022 \u001b[0m`;
export const emptyMarble: String = `   `;

const alphabet: String = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function renderBoard(board: Board): String {
    const columnLetters = alphabet.substr(0, board[0].length)
    const header = columnLetters.split("").map(char => ` ${char} `)
    const firstLine = '   ' + header.join("")

    let result = firstLine + '\n';

    for (let i = 0; i < board.length; i++) {
        let line = ` ${i} `;
        for (const marble of board[i]) {
            line += marbleValuetoANSIColorCode(marble);

        }
        result += line + '\n';
    }

    return result;
}

function marbleValuetoANSIColorCode(marble: number): String {
    const marbleColor = [emptyMarble];
    marbleColor[1] = redMarble;
    marbleColor[2] = blueMarble;
    marbleColor[3] = whiteMarble;
    return marbleColor[marble];
}

export function renderToConsole(graphicalBoard: String) {
    console.log(graphicalBoard)
}