import expect from "expect";
import { getInitialBoard } from './Board'
import { buildGraphicalBoard } from './VisualBoard'

describe("initial test", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });

  it("should getInitial Board", () => {
    let firstBoard = getInitialBoard();
    expect(firstBoard).toStrictEqual([[1, 1, 0, 0, 0, 2, 2], [1, 1, 0, 3, 0, 2, 2], [0, 0, 3, 3, 3, 0, 0], [0, 3, 3, 3, 3, 3, 0], [0, 0, 3, 3, 3, 0, 0], [2, 2, 0, 3, 0, 1, 1], [2, 2, 0, 0, 0, 1, 1]]);
  });
});
