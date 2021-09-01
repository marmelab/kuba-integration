import expect from "expect";
import {
  RED_MARBLE,
  BLUE_MARBLE,
  EMPTY_MARBLE,
  WHITE_MARBLE,
  renderBoard,
} from "./RenderBoard";
import { Player } from "./Types";

import { switchToNextPlayer } from "./game";

describe("switch player trun", () => {
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
