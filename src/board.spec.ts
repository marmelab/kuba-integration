import expect from "expect";
import {
  getInitialBoard,
  getBoardFromFile,
  checkMoveMarbleInDirection,
} from "./board";
import { boardToGraph } from "./graph";
import { Player } from "./types";
import { close } from "./userInput";
import { INITIAL_BOARD } from "./constants";
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

    const board = await getBoardFromFile("assets/board-test.json");

    expect(board).toStrictEqual(customGameBoard);
  });

  it("should turn over a empty board if bad path specified", async () => {
    const board = await getBoardFromFile("badpath");

    expect(board).toStrictEqual([]);
  });

  describe("checkMoveMarbleInDirection", () => {
    it("should return true or false when a position, a direction and a Graph is passed as parameter with the checkMoveMarbleInDirection function", () => {
      const graph = boardToGraph(firstBoard);
      let player1: Player = {
        playerNumber: 1,
        marbleColor: 1,
        marblesWon:[]
      };
      let player2: Player = {
        playerNumber: 2,
        marbleColor: 2,
        marblesWon:[]
      };

      const errorDirection = new CantMoveError(
        "This position does not exist in the board"
      );
      const errorPosition = new CantMoveError(
        "No free space before the marble"
      );
      const errorColor = new CantMoveError(
        "This marble can't be moved because it is not your color"
      );

      expect(() => {
        checkMoveMarbleInDirection(graph, "1,0", "E", player1);
      }).toThrowError(errorPosition);
      expect(() => {
        checkMoveMarbleInDirection(graph, "0,0", "S", player2);
      }).toThrowError(errorColor);
      expect(() => {
        checkMoveMarbleInDirection(graph, "1,25", "E", player1);
      }).toThrowError(errorDirection);
      expect(() => {
        checkMoveMarbleInDirection(graph, "1,25", "E", player1);
      }).toThrowError(errorDirection);
    });
  });
});
