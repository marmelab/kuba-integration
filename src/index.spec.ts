import expect from "expect";
import { getInitialBoard } from './Board'
import { renderBoard } from './RenderBoard'

describe("initial test", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });

  it("should getInitial Board", () => {
    const firstBoard = getInitialBoard();
    expect(firstBoard).toStrictEqual([[1, 1, 0, 0, 0, 2, 2], [1, 1, 0, 3, 0, 2, 2], [0, 0, 3, 3, 3, 0, 0], [0, 3, 3, 3, 3, 3, 0], [0, 0, 3, 3, 3, 0, 0], [2, 2, 0, 3, 0, 1, 1], [2, 2, 0, 0, 0, 1, 1]]);
  });

  it("should getGraphical Board", () => {
    const board = [[1, 2], [0, 3]];
    const graphicalBoard = renderBoard(board)
    expect(graphicalBoard).toBe("    A  B \n 0 \u001b[31m • \u001b[0m\u001b[34m • \u001b[0m\n 1    \u001b[37m • \u001b[0m\n");
  });
});
