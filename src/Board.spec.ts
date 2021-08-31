import expect from "expect";
import { getInitialBoard, getBoardFromFile, INITIAL_BOARD } from "./Board";
import { close } from './UserInput';

describe("Board test", () => {
  afterAll(() => {
    close();
  });

  it("should turn over the initial game board", () => {
    const firstBoard = getInitialBoard();

    expect(firstBoard).toStrictEqual(INITIAL_BOARD);
  });

  it("should turn over a custom game board with good path", async () => {
    const customGameBoard = [
      [1, 2],
      [0, 3],
    ];

    const board = await getBoardFromFile("src/board.json");

    expect(board).toStrictEqual(customGameBoard);
  });

  it("should turn over a empty board if bad path specified", async () => {
    const board = await getBoardFromFile("badpath");

    expect(board).toStrictEqual([]);
  });

  
});
