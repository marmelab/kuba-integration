import expect from "expect";
import { getInitialBoard, canMoveMarbleInDirection } from "./Board";
import { boardToGraph } from "./Graph";

describe("Board test", () => {
  let firstBoard;

  beforeEach(() => {
    firstBoard = getInitialBoard();
  });

  it("should turn over the initial game board", () => {
    expect(firstBoard).toStrictEqual([
      [1, 1, 0, 0, 0, 2, 2],
      [1, 1, 0, 3, 0, 2, 2],
      [0, 0, 3, 3, 3, 0, 0],
      [0, 3, 3, 3, 3, 3, 0],
      [0, 0, 3, 3, 3, 0, 0],
      [2, 2, 0, 3, 0, 1, 1],
      [2, 2, 0, 0, 0, 1, 1],
    ]);
  });

  describe("canMoveMarbleInDirection", () => {
    it("should return true or false when a position, a direction and a Graph is passed as parameter with the canMoveMarbleInDirection function", () => {
      const graph = boardToGraph(firstBoard);
      expect(canMoveMarbleInDirection(graph, "0,0", "E")).toBe(true);
      expect(canMoveMarbleInDirection(graph, "1,0", "E")).toBe(false);
    });
  });
});
