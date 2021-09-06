import { Player, Board, Graph, GameState } from "./types";

import { close } from "./userInput";
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
    const gameState = await response.json() as GameState;
    return gameState;
  } catch (ex) {
    console.log("parsing failed", ex);
  };
};

export const pullGameState = (): Promise<GameState> => {
  const gameState = fetch(`${URL}/gamestate`)
    .then(function (response) {
      return response.json();
    })
    .catch(function (ex) {
      console.log("parsing failed", ex);
    });

  return gameState;
};

export const pullCanMoveMarblePlayable = (
  gameState: GameState,
  direction: string
): Promise<boolean> => {
  const canMoveMarble = fetch(`${URL}/marbleplayable`)
    .then(function (response) {
      return response.json();
    })
    .catch(function (ex) {
      console.log("parsing failed", ex);
    });

  return canMoveMarble;
};

const moveMarble = (gameState: GameState, direction: string): any => {
  const canMoveMarble = fetch(`${URL}/movemarble`)
    .then(function (response) {
      return response.json();
    })
    .catch(function (ex) {
      console.log("parsing failed", ex);
    });

  return canMoveMarble;
};

export const pullActions = async (
  gameState: GameState,
  direction: string
): Promise<void> => {
  const canMoveMarble = await pullCanMoveMarblePlayable(gameState, direction);
  if (canMoveMarble) {
    await moveMarble(gameState, direction);
  }
};
