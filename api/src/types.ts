export type Node = {
  x: number;
  y: number;
  value: number;
  isExit: Boolean;
};

export type Direction = 'N' | 'S' | 'E' | 'W';

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

export type Board = number[][];

export type Derivation = {
  x: number;
  y: number;
};

export type DirectionInBoard = {
  [coordinates: string]: Derivation;
};

export type Coordinates = string;

export type Player = {
  playerNumber: number;
  marbleColor: number;
  marblesWon: number[];
};

export type UserMove = {
  marblePosition: string;
  direction: string;
};

export type GameState = {
  id: number | null;
  graph: Graph | null;
  currentPlayerId: number | null;
  players: Player[] | null;
  marbleClicked: Node | null;
  directionSelected: string | null;
  hasWinner: boolean;
  started: boolean;
  creationDate: any;
  lastMoveDate: any;
};

export type Admin = {
  id: number;
  email: string;
  role: string;
};
