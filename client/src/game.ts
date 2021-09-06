import { Player, Board, Graph, GameState } from "./types";

import { close } from "./userInput";
import { PLAYER_ID } from "./index";
import { initScreenView, renderScreenView } from "./blessed";
import { URL } from "./constants";
require("isomorphic-fetch");

export const startNewGame = async (numberPlayer: number) => {
  close();
  initScreenView();
  const gameState = await pullNewGame(numberPlayer);

  renderScreenView(gameState);
};

export const pullNewGame = async (playerNumber: number): Promise<GameState> => {
  try {
    const response = await fetch(`${URL}/startgame`, {
      method: "POST",
      body: JSON.stringify({ playerNumber }),
      headers: { "Content-Type": "application/json" },
    });
    const gameState = (await response.json()) as GameState;
    return gameState;
  } catch (ex) {
    console.log("parsing failed", ex);
  }
};

export const pullGameState = async (): Promise<GameState> => {
  try {
    const response = await fetch(`${URL}/gamestate`);
    const gameState: GameState = (await response.json()) as GameState;
    return gameState;
  } catch (ex) {
    console.log(`parsing failed`, ex);
  }
};

export const pullCanMoveMarblePlayable = async (
  gameState: GameState,
  direction: string,
  player: Player
): Promise<boolean> => {
  try {
    const response = await fetch(`${URL}/marbleplayable`, {
      method: "POST",
      body: JSON.stringify({ gameState, direction, player }),
      headers: { "Content-Type": "application/json" },
    });
    const canMove: boolean = (await response.json()) as boolean;

    return canMove;
  } catch (ex) {
    console.log(`parsing has failed`, ex);
  }
};

const moveMarble = async (
  gameState: GameState,
  direction: string,
  player: Player
): Promise<GameState> => {
  try {
    const response = await fetch(`${URL}/movemarble`, {
      method: "POST",
      body: JSON.stringify({ gameState, direction, player }),
      headers: { "Content-Type": "application/json" },
    });

    const gameStateAfterMove: GameState = (await response.json()) as GameState;

    return gameStateAfterMove;
  } catch (ex) {
    console.log(`parsing has failed`, ex);
  }
};

export const pullActions = async (
  gameState: GameState,
  direction: string
): Promise<void> => {
  const player = gameState.players.find((item) => {
    return PLAYER_ID === item.playerNumber;
  });

  const canMoveMarble = await pullCanMoveMarblePlayable(
    gameState,
    direction,
    player
  );

  if (canMoveMarble) {
    const newGameState = await moveMarble(gameState, direction, player);
    renderScreenView(newGameState);
  }
};
