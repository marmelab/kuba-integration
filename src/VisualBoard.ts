
export function render(board: Array<Array<number>>) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lettresEntete = ' ' + alphabet.substr(0, board[0].length)
    const entete = lettresEntete.split("").map(char => ` ${char} `)
    const firstLine = entete.join("")

    console.log(firstLine)

    for (let i = 0; i < board.length; i++) {
        let line = ` ${i} `;
        for (const value of board[i]) {
            line += ` ${value} `
        }
        console.log(line)
    }

}