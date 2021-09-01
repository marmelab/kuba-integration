import expect from "expect";
import { Graph, Board } from "./Types";
import { getInitialBoard } from "./Board";
import { boardToGraph, positionToCoordinate, moveMarbleInDirection } from "./Graph";

const INITAL_BOARD: Board = [
  [1, 1, 1],
  [2, 0, 1],
  [1, 1, 1],
];

describe("Graph test", () => {
  it("should return a well formed Graph when a Board is passed as argument with the boardToGraph method", () => {
    const GRAPH: Graph = boardToGraph(INITAL_BOARD);

    expect(GRAPH.nodes).toBeTruthy();
    expect(GRAPH.nodes["0,0"].value).toBe(1);
    expect(GRAPH.nodes["1,1"].isExit).toBe(false);
    expect(GRAPH.nodes["0,1"].isExit).toBe(true);
    expect(GRAPH.edges[0].from).toBe("0,0");
    expect(GRAPH);

  });

  it("should transform position into coordinate", () => {
    const position = "B23";
    const coordinateResult = { x: 1, y: 23 };

    const coordinate = positionToCoordinate(position);

    expect(coordinate).toStrictEqual(coordinateResult);
  });

  it("should return undefined if position not match pattern", () => {
    const position = "13D";

    const coordinate = positionToCoordinate(position);

    expect(coordinate).toBe(undefined);
  });

  it("should move marbles from start position and good direction", () => {
    const graph = {
      nodes: {
        "0,0": { x: 0, y: 0, value: 1, isExit: false },
        "0,1": { x: 0, y: 1, value: 1, isExit: false },
        "0,2": { x: 0, y: 1, value: 0, isExit: false },
        "0,3": { x: 0, y: 1, value: 2, isExit: false },
      },
      edges: [],
    };
    const position = "A0";
    const coordinate = {x: 0, y: 0};
    const direction = "E"

    const graphMoved = moveMarbleInDirection(graph, coordinate, direction);

    expect(coordinate).toBe(graphMoved);
  });
});
