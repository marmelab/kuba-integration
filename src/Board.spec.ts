import expect from "expect";
import { getInitialBoard } from './Board'

describe("Board test", () => {
  it("should turn over the initial game board", () => {
    const firstBoard = getInitialBoard();
    expect(firstBoard).toStrictEqual([
        [1, 1, 0, 0, 0, 2, 2], 
        [1, 1, 0, 3, 0, 2, 2], 
        [0, 0, 3, 3, 3, 0, 0], 
        [0, 3, 3, 3, 3, 3, 0], 
        [0, 0, 3, 3, 3, 0, 0], 
        [2, 2, 0, 3, 0, 1, 1], 
        [2, 2, 0, 0, 0, 1, 1]
    ]);
  });
});
