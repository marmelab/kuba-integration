import expect from "expect";
import { Player } from "./types";
import { close } from "./userInput";
import {
  switchToNextPlayer,
  marbleWonByPlayer,
  checkIfPlayerWon,
} from "./game";

const GRAPH = {
  nodes: {
    "0,0": { x: 0, y: 0, value: 1, isExit: false },
    "0,1": { x: 0, y: 1, value: 1, isExit: false },
    "0,2": { x: 0, y: 2, isExit: true },
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

  describe("Switch players", () => {
    it("should return the next player who will play when the actual player and an array of players are given in arguments with the switchPlayers function ", () => {
      const player1: Player = {
        playerNumber: 1,
        marbleColor: 1,
        marblesWon: [],
      };

      const player2: Player = {
        playerNumber: 2,
        marbleColor: 2,
        marblesWon: [],
      };

      const players: Array<Player> = [player1, player2];

      expect(switchToNextPlayer(player1, players)).toEqual(player2);
      expect(switchToNextPlayer(player2, players)).toEqual(player1);
    });
  });

  describe("Player turn when marble exits", () => {
    it("should set the same player for this turn when a marble has been exited by this player", () => {});
  });
});

describe("Checks if the player has won a marble", () => {
  it("should return false if no marble has been won", () => {
    const playerHasWinMarble = marbleWonByPlayer(GRAPH);

    expect(playerHasWinMarble).toBe(-1);
  });
  it("should return true if a marble has been won", () => {
    const playerHasWinMarble = marbleWonByPlayer(GRAPH_WITH_MARBLE_IN_EXIT);

    expect(playerHasWinMarble).toBe(1);
  });
});

describe("Checks if the player has won the game", () => {
  it("should return false if a player has less than 7 marbles", () => {
    const player: Player = {
      playerNumber: 1,
      marbleColor: 1,
      marblesWon: [],
    };

    const playerWon = checkIfPlayerWon(player);

    expect(playerWon).toBe(false);
  });
  it("should return true if a player has 7 marbles", () => {
    const player: Player = {
      playerNumber: 1,
      marbleColor: 1,
      marblesWon: [2, 3, 1, 1, 2, 3, 3],
    };

    const playerWon = checkIfPlayerWon(player);

    expect(playerWon).toBe(true);
  });
});
