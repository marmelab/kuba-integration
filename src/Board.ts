
export type Board = Array<Array<number>>;

export function getInitialBoard(): Board {
    return [
        [1, 1, 0, 0, 0, 2, 2],
        [1, 1, 0, 3, 0, 2, 2],
        [0, 0, 3, 3, 3, 0, 0],
        [0, 3, 3, 3, 3, 3, 0],
        [0, 0, 3, 3, 3, 0, 0],
        [2, 2, 0, 3, 0, 1, 1],
        [2, 2, 0, 0, 0, 1, 1]
    ];
}