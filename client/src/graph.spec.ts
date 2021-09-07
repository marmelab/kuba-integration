import expect from "expect";
import { Graph, Board } from "./types";
import {
  boardToGraph,
  positionToCoordinate,
  moveMarbleInDirection,
  graphToBoard,
} from "./graph";
import { UserPositionError } from "./error";

const initialBoard: Board = [
  [1, 1, 1],
  [1, 0, 2],
  [1, 2, 2],
];

describe("graph test", () => {
  it("should return a well formed Graph when a Board is passed as argument with the boardToGraph function", () => {
    const graph: Graph = boardToGraph(initialBoard);

    expect(graph.nodes).toBeTruthy();
    expect(graph.nodes["0,0"].value).toBe(1);
    expect(graph.nodes["1,1"].isExit).toBe(false);
    expect(graph.nodes["-1,1"].isExit).toBe(true);
    expect(graph.edges[0].from).toBe("-1,-1");
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

  it("should transform position into coordinate", () => {
    const position = "B23";
    const coordinateResult = { x: 1, y: 23 };

    const coordinate = positionToCoordinate(position);

    expect(coordinate).toStrictEqual(coordinateResult);
  });

  it("should throw an error if position not match pattern", () => {
    const position = "13D";
    const error = new UserPositionError("This position is not well formatted");

    expect(() => {
      positionToCoordinate(position);
    }).toThrowError(error);
  });

  it("should not move marbles because start on value 0", () => {
    const coordinate = { x: 0, y: 2 };
    const direction = "N";
    const graph = {
      nodes: {
        "0,0": { x: 0, y: 0, value: 1, isExit: false },
        "0,1": { x: 0, y: 1, value: 1, isExit: false },
        "0,2": { x: 0, y: 2, value: 0, isExit: false },
        "0,3": { x: 0, y: 3, value: 2, isExit: false },
      },
      edges: [],
    };
    const movedGraph = {
      nodes: {
        "0,0": { x: 0, y: 0, value: 1, isExit: false },
        "0,1": { x: 0, y: 1, value: 1, isExit: false },
        "0,2": { x: 0, y: 2, value: 0, isExit: false },
        "0,3": { x: 0, y: 3, value: 2, isExit: false },
      },
      edges: [],
    };

    const graphMoved = moveMarbleInDirection(graph, coordinate, direction);

    expect(graphMoved).toStrictEqual(movedGraph);
  });

  it("should move marbles from start position and vertical direction", () => {
    const coordinate = { x: 0, y: 0 };
    const direction = "E";
    const graph: Graph = {
      nodes: {
        "0,0": { x: 0, y: 0, value: 1, isExit: false },
        "1,0": { x: 1, y: 0, value: 1, isExit: false },
        "2,0": { x: 2, y: 0, value: 0, isExit: false },
        "3,0": { x: 3, y: 0, value: 2, isExit: false },
      },
      edges: [
        { from: "0,0", to: "1,0", direction: "E" },
        { from: "1,0", to: "2,0", direction: "E" },
        { from: "2,0", to: "3,0", direction: "E" },
        { from: "3,0", to: "4,0", direction: "E" },
      ],
    };
    const movedGraph = {
      nodes: {
        "0,0": { x: 0, y: 0, value: 0, isExit: false },
        "1,0": { x: 1, y: 0, value: 1, isExit: false },
        "2,0": { x: 2, y: 0, value: 1, isExit: false },
        "3,0": { x: 3, y: 0, value: 2, isExit: false },
      },
      edges: [
        { from: "0,0", to: "1,0", direction: "E" },
        { from: "1,0", to: "2,0", direction: "E" },
        { from: "2,0", to: "3,0", direction: "E" },
        { from: "3,0", to: "4,0", direction: "E" },
      ],
    };

    const graphMoved = moveMarbleInDirection(graph, coordinate, direction);

    expect(graphMoved).toStrictEqual(movedGraph);
  });

  it("should move marbles from start position and vertical direction on exit", () => {
    const coordinate = { x: 0, y: 0 };
    const direction = "E";
    const graph: Graph = {
      nodes: {
        "0,0": { x: 0, y: 0, value: 1, isExit: false },
        "1,0": { x: 1, y: 0, value: 1, isExit: false },
        "2,0": { x: 2, y: 0, value: -1, isExit: true },
      },
      edges: [
        { from: "0,0", to: "1,0", direction: "E" },
        { from: "1,0", to: "2,0", direction: "E" },
      ],
    };
    const movedGraph = {
      nodes: {
        "0,0": { x: 0, y: 0, value: 0, isExit: false },
        "1,0": { x: 1, y: 0, value: 1, isExit: false },
        "2,0": { x: 2, y: 0, value: 1, isExit: true },
      },
      edges: [
        { from: "0,0", to: "1,0", direction: "E" },
        { from: "1,0", to: "2,0", direction: "E" },
      ],
    };

    const graphMoved = moveMarbleInDirection(graph, coordinate, direction);

    expect(graphMoved).toStrictEqual(movedGraph);
  });

  it("should move marbles from start position and horizontal direction", () => {
    const coordinate = { x: 0, y: 3 };
    const direction = "N";
    const graph: Graph = {
      nodes: {
        "0,0": { x: 0, y: 0, value: 1, isExit: false },
        "0,1": { x: 0, y: 1, value: 1, isExit: false },
        "0,2": { x: 0, y: 2, value: 0, isExit: false },
        "0,3": { x: 0, y: 3, value: 2, isExit: false },
      },
      edges: [
        { from: "0,1", to: "0,0", direction: "N" },
        { from: "0,2", to: "0,1", direction: "N" },
        { from: "0,3", to: "0,2", direction: "N" },
        { from: "0,4", to: "0,3", direction: "N" },
      ],
    };
    const movedGraph = {
      nodes: {
        "0,0": { x: 0, y: 0, value: 1, isExit: false },
        "0,1": { x: 0, y: 1, value: 1, isExit: false },
        "0,2": { x: 0, y: 2, value: 2, isExit: false },
        "0,3": { x: 0, y: 3, value: 0, isExit: false },
      },
      edges: [
        { from: "0,1", to: "0,0", direction: "N" },
        { from: "0,2", to: "0,1", direction: "N" },
        { from: "0,3", to: "0,2", direction: "N" },
        { from: "0,4", to: "0,3", direction: "N" },
      ],
    };

    const graphMoved = moveMarbleInDirection(graph, coordinate, direction);

    expect(graphMoved).toStrictEqual(movedGraph);
  });
});
