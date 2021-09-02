import expect from "expect";
import {
  getInitialBoard,
  getBoardFromFile,
  INITIAL_BOARD,
  canMoveMarbleInDirection,
} from "./Board";
import { boardToGraph } from "./Graph";
import { close } from "./UserInput";
import { CantMoveError } from "./error";

describe("Board test", () => {
  let firstBoard;

  afterAll(() => {
    close();
  });

  beforeEach(() => {
    firstBoard = getInitialBoard();
  });

  it("should turn over the initial game board", () => {
    expect(firstBoard).toStrictEqual(INITIAL_BOARD);
  });

  it("should turn over a custom game board with good path", async () => {
    const customGameBoard = [
      [1, 2],
      [0, 3],
    ];

    const board = await getBoardFromFile("assets/board.json");

    expect(board).toStrictEqual(customGameBoard);
  });

  it("should turn over a empty board if bad path specified", async () => {
    const board = await getBoardFromFile("badpath");

    expect(board).toStrictEqual([]);
  });

  describe("canMoveMarbleInDirection", () => {
    it("should return true or false when a position, a direction and a Graph is passed as parameter with the canMoveMarbleInDirection function", () => {
      const graph = boardToGraph(firstBoard);
      const error = new CantMoveError('This move is not allowed');

      expect(canMoveMarbleInDirection(graph, "0,0", "E")).toBe(true);
      expect(() => {canMoveMarbleInDirection(graph, "1,0", "E")}).toThrowError(error);
    });
  });
});
