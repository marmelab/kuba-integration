import expect from "expect";
import {
  RED_MARBLE,
  BLUE_MARBLE,
  EMPTY_MARBLE,
  WHITE_MARBLE,
  renderBoard,
} from "./renderBoard";

describe("RenderBoard test", () => {
  it("should return a string that graphically represents a board with renderBoard method", () => {
    const board = [
      [1, 2],
      [0, 3],
    ];
    const expectedGraphicalBoard =
      "" +
      "    A  B \n" +
      ` 0 ${RED_MARBLE}${BLUE_MARBLE}\n` +
      ` 1 ${EMPTY_MARBLE}${WHITE_MARBLE}\n`;

    const graphicalBoard = renderBoard(board);

    expect(graphicalBoard).toBe(expectedGraphicalBoard);
  });
});
