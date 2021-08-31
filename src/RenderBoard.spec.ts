import expect from "expect";
import { redMarble, blueMarble, emptyMarble, whiteMarble, renderBoard } from './RenderBoard'

describe("RenderBoard test", () => {
  it("should return a string that graphically represents a board with renderBoard method", () => {
    const board = [[1, 2], [0, 3]];
    const expectedGraphicalBoard = ''
    + '    A  B \n'
    + ` 0 ${redMarble}${blueMarble}\n`
    + ` 1 ${emptyMarble}${whiteMarble}\n`;

    const graphicalBoard = renderBoard(board);

    expect(graphicalBoard).toBe(expectedGraphicalBoard);
  });
});
