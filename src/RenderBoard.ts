import { Board } from './Board'

export function renderBoard(board: Board): String {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
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
    let marbleColor: String;
    const redMarble = `\u001b[31m \u2022 \u001b[0m`;
    const blueMarble = `\u001b[34m \u2022 \u001b[0m`;
    const whiteMarble = `\u001b[37m \u2022 \u001b[0m`;
    const emptyMarble = `   `;

    switch (marble) {
        case 1:
            marbleColor = redMarble;
            break;
        case 2:
            marbleColor = blueMarble;
            break;
        case 3:
            marbleColor = whiteMarble;
            break;
        default:
            marbleColor = emptyMarble;
    }

    return marbleColor;
}

export function renderToConsole(graphicalBoard: String) {
    console.log(graphicalBoard)
}