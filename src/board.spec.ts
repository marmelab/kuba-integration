import expect from "expect";
import {
  getInitialBoard,
  getBoardFromFile,
  canMoveMarbleInDirection,
} from "./board";
import { boardToGraph } from "./graph";
import { Player } from "./types";
import { close } from "./userInput";
import { INITIAL_BOARD } from "./constants";

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
      let player1: Player = {
        playerNumber: 1,
        marbleColor: 1,
      };
      let player2: Player = {
        playerNumber: 2,
        marbleColor: 2,
      };
      expect(canMoveMarbleInDirection(graph, "0,0", "E", player1)).toBe(true);
      expect(canMoveMarbleInDirection(graph, "1,0", "E", player1)).toBe(false);
      expect(canMoveMarbleInDirection(graph, "5,0", "S", player2)).toBe(true);
      expect(canMoveMarbleInDirection(graph, "0,0", "S", player2)).toBe(false);
    });
  });
});
