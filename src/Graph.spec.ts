import expect from "expect";
import { Graph, Board } from "./Types";
import { getInitialBoard } from "./Board";
import { boardToGraph } from "./Graph";

const INITIAL_BOARD: Board = [
  [1, 1, 1],
  [2, 0, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
];

describe("boardToGraph", () => {
  it("should return a well formed Graph when a Board is passed as argument with the boardToGraph method", () => {
    const GRAPH: Graph = boardToGraph(INITIAL_BOARD);

    expect(GRAPH.nodes).toBeTruthy();
    expect(GRAPH.nodes["0,0"].value).toBe(1);
    expect(GRAPH.nodes["1,1"].isExit).toBe(false);
    expect(GRAPH.nodes["0,1"].isExit).toBe(true);
    expect(GRAPH.edges[0].from).toBe("0,0");
  });
});
