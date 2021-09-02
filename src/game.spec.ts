import expect from "expect";
import { Player } from "./types";
import { close } from "./userInput";

import { switchToNextPlayer } from "./game";

describe("game", () => {
  afterAll(() => {
    close();
  });

  describe("Switch players", () => {
    it("should return the next player who will play when the actual player and an array of players are given in arguments with the switchPlayers function ", () => {
      const player1: Player = {
        playerNumber: 1,
        marbleColor: 1,
      };

      const player2: Player = {
        playerNumber: 2,
        marbleColor: 2,
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
