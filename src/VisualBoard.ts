
export function render(board: Array<Array<number>>) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lettresEntete = ' ' + alphabet.substr(0, board[0].length)
    const entete = lettresEntete.split("").map(char => ` ${char} `)
    const firstLine = entete.join("")

    console.log(firstLine)

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
        console.log(line)
    }

}