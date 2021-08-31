const fs = require('fs')

export type Board = Array<Array<number>>;
export const INITIAL_BOARD: Board= [
    [1, 1, 0, 0, 0, 2, 2],
    [1, 1, 0, 3, 0, 2, 2],
    [0, 0, 3, 3, 3, 0, 0],
    [0, 3, 3, 3, 3, 3, 0],
    [0, 0, 3, 3, 3, 0, 0],
    [2, 2, 0, 3, 0, 1, 1],
    [2, 2, 0, 0, 0, 1, 1]
];

export async function getInitialBoard(customPath: String): Promise<Board> {
    let board;

    if (customPath) {
        const data: string = await new Promise((resolve, reject) => {
            fs.readFile(customPath, 'utf8', (err: string, data: string) => {
                if (err) {
                    console.error(err)
                    reject();
                }
                resolve(data);
            })
        })

        board = JSON.parse(data).board;
    }

    if (!board) {
        board = INITIAL_BOARD;
    }

    return board;
}