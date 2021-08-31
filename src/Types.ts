export type Node = {
  x: number;
  y: number;
  value: number;
  isExit: Boolean;
};

export type Direction = "N" | "S" | "E" | "W";

export type Edge = {
  from: string;
  to: string;
  direction: Direction;
};

export type Graph = {
  nodes: {
    [coordinates: string]: Node;
  };
  edges: Array<Edge>;
};

export type Board = Array<Array<number>>;

export type Deriv = {
  x: number;
  y: number;
};

export type DirectionInBoard = {
  [coordinates: string]: Deriv;
};

export type Coordinates = string;
