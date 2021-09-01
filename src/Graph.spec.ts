import expect from "expect";
import { Graph, Board } from "./Types";
import { getInitialBoard } from "./Board";
import { boardToGraph, graphToBoard } from "./Graph";

const INITAL_BOARD: Board = [
  [1, 1, 1],
  [2, 0, 1],
  [1, 1, 1],
];

describe("boardToGraph", () => {
  it("should return a well formed Graph when a Board is passed as argument with the boardToGraph function", () => {
    const graph: Graph = boardToGraph(INITAL_BOARD);

    expect(graph.nodes).toBeTruthy();
    expect(graph.nodes["0,0"].value).toBe(1);
    expect(graph.nodes["1,1"].isExit).toBe(false);
    expect(graph.nodes["0,1"].isExit).toBe(true);
    expect(graph.edges[0].from).toBe("0,0");
    expect(graph);
  });
});

describe("graphToBoard", () => {
  it("should return a well formed Board when a graph is passed as argument with the graphToBoard function", () => {
    const customBoard: Board = [
      [1, 2, 0],
      [2, 2, 2],
      [3, 1, 0],
    ];

    const graph: Graph = boardToGraph(customBoard);

    const boardFromGraph: Board = graphToBoard(graph);

    expect(boardFromGraph).toEqual(customBoard);
  });
});
