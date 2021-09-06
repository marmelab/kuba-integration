import { close } from "./userInput";

const GRAPH = {
  nodes: {
    "0,0": { x: 0, y: 0, value: 1, isExit: false },
    "0,1": { x: 0, y: 1, value: 1, isExit: false },
    "0,2": { x: 0, y: 2, value: -1, isExit: true },
  },
  edges: [],
};
const GRAPH_WITH_MARBLE_IN_EXIT = {
  nodes: {
    "0,0": { x: 0, y: 0, value: 0, isExit: false },
    "0,1": { x: 0, y: 1, value: 1, isExit: false },
    "0,2": { x: 0, y: 2, value: 1, isExit: true },
  },
  edges: [],
};

describe("game", () => {
  afterAll(() => {
    close();
  });

  describe("Get gameState from API", () => {
    it("should get a initial gameState", () => {});
  });
});
