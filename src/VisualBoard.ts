
export function buildGraphicalBoard(board: Array<Array<number>>): String {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const headerLetter = ' ' + alphabet.substr(0, board[0].length)
    const header = headerLetter.split("").map(char => ` ${char} `)
    const firstLine = header.join("")
    
    let result = firstLine + '\n';

    for (let i = 0; i < board.length; i++) {
        let line = ` ${i} `;
        for (const value of board[i]) {
            switch (value) {
                case 1:
                    line += `\u001b[31m \u2022 \u001b[0m`
                    break;
                case 2:
                    line += `\u001b[34m \u2022 \u001b[0m`
                    break;

                case 3:
                    line += `\u001b[37m \u2022 \u001b[0m`
                    break;
                default:
                    line += `   `
            }

        }
        result += line + '\n';
    }

    return result;
}

export function render(graphicalBoard: String) {
    console.log(graphicalBoard)
}