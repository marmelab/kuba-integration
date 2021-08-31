export type Node = {
  x: number;
  y: number;
  value: number;
  isExit: Boolean;
};

export type Edge = {
  from: string;
  to: string;
  direction: string;
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

export type Direction = {
  [direction: string]: Deriv;
};
