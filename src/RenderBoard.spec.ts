import expect from "expect";
import { getInitialBoard } from './Board'
import { redMarble, blueMarble, emptyMarble, whiteMarble, renderBoard } from './RenderBoard'

describe("RenderBoard test", () => {
  it("should return a string that graphically represents a board", () => {
    const board = [[1, 2], [0, 3]];
    const graphicalBoard = renderBoard(board);

    const expectedGraphicalBoard = ''
    + '    A  B \n'
    + ` 0 ${redMarble}${blueMarble}\n`
    + ` 1 ${emptyMarble}${whiteMarble}\n`;

    expect(graphicalBoard).toBe(expectedGraphicalBoard);
  });
});
