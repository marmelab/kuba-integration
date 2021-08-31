import expect from "expect";
import { renderBoard } from './RenderBoard';

describe("RenderBoard test", () => {
  it("should return a string that graphically represents a board", () => {
    const board = [[1, 2], [0, 3]];
    const graphicalBoard = renderBoard(board);
    const redMarble = '\u001b[31m • ';
    const blueMarble = '\u001b[0m\u001b[34m • ';
    const whiteMarble = '\u001b[37m • ';
    const emptyMarble = '   ';
    const resetColor = '\u001b[0m';


    const expectedGraphicalBoard = ''
    + '    A  B \n'
    + ` 0 ${redMarble}${blueMarble}${resetColor}\n`
    + ` 1 ${emptyMarble}${whiteMarble}${resetColor}\n`;

    expect(graphicalBoard).toBe(expectedGraphicalBoard);
  });
});
