import { Player, GameState } from './types';

import { close } from './userInput';
import { PLAYER_ID } from './index';
import { initScreenView, renderScreenView } from './blessed';
import { URL } from './constants';
import { GameError } from './error';
require('isomorphic-fetch');

export let currentState: GameState;

export const startNewGame = async (numberPlayer: number) => {
  close();
  initScreenView();

  const gameState = await pullNewGame(numberPlayer);
  renderScreenView(gameState);

  currentState = gameState;

  setInterval(async () => {
    const hasChanged = await pullGameStateChanged(currentState);

    if (hasChanged) {
      const gameState = await pullGameState();
      renderScreenView(gameState);
      currentState = gameState;
    }
  }, 5000);
};

export const pullNewGame = async (playerNumber: number): Promise<GameState> => {
  try {
    const response = await fetch(`${URL}/startgame`, {
      method: 'POST',
      body: JSON.stringify({ playerNumber }),
      headers: { 'Content-Type': 'application/json' },
    });
    const jsonResp = await response.json();
    const gameState: GameState = jsonResp as GameState;
    return gameState;
  } catch (ex) {
    throw new GameError("The game can't be launched");
  }
};

export const pullGameState = async (): Promise<GameState> => {
  try {
    const response = await fetch(`${URL}/gamestate`);
    const jsonResp = await response.json();
    const gameState: GameState = jsonResp as GameState;
    return gameState;
  } catch (ex) {
    throw new GameError("The game state can't be laoaded");
  }
};

export const pullGameStateChanged = async (
  playerGameState: GameState,
): Promise<boolean> => {
  try {
    const response = await fetch(`${URL}/gamestatehaschanged`, {
      method: 'POST',
      body: JSON.stringify(playerGameState),
      headers: { 'Content-Type': 'application/json' },
    });

    const jsonResp = await response.json();
    const gameStateHasChanged: boolean = jsonResp as boolean;
    return gameStateHasChanged;
  } catch (ex) {
    throw new GameError("The game state can't be compared");
  }
};

export const pullCanMoveMarblePlayable = async (
  gameState: GameState,
  direction: string,
  player: Player,
): Promise<boolean> => {
  try {
    const response = await fetch(`${URL}/marbleplayable`, {
      method: 'POST',
      body: JSON.stringify({ gameState, direction, player }),
      headers: { 'Content-Type': 'application/json' },
    });
    const jsonResp = await response.json();
    const canMove: boolean = jsonResp as boolean;

    return canMove;
  } catch (ex) {
    throw new GameError('Unable to call the function can move marble');
  }
};

const moveMarble = async (
  gameState: GameState,
  direction: string,
  player: Player,
): Promise<GameState> => {
  try {
    const response = await fetch(`${URL}/movemarble`, {
      method: 'POST',
      body: JSON.stringify({ gameState, direction, player }),
      headers: { 'Content-Type': 'application/json' },
    });

    const jsonResp = await response.json();
    const gameStateAfterMove: GameState = jsonResp as GameState;

    currentState = gameStateAfterMove;
    return gameStateAfterMove;
  } catch (ex) {
    throw new GameError('Unable to call the function move marble');
  }
};

export const pullActions = async (
  gameState: GameState,
  direction: string,
): Promise<void> => {
  const player = gameState.players.find((item) => {
    return PLAYER_ID === item.playerNumber;
  });

  try {
    const canMoveMarble = await pullCanMoveMarblePlayable(
      gameState,
      direction,
      player,
    );

    if (canMoveMarble) {
      const newGameState = await moveMarble(gameState, direction, player);
      renderScreenView(newGameState);
    }
  } catch (e) {
    console.log(e);
  }
};

export const postGameState = async (
  gameState: GameState,
): Promise<GameState> => {
  try {
    const response = await fetch(`${URL}/setgamestate`, {
      method: 'POST',
      body: JSON.stringify(gameState),
      headers: { 'Content-Type': 'application/json' },
    });

    const jsonResp = await response.json();
    const newGameState: GameState = jsonResp as GameState;

    return newGameState;
  } catch (ex) {
    throw new GameError('Unable to call the function postGameState');
  }
};

export const setCurrentState = (gameState: GameState) => {
  currentState = gameState;
};

export const restartGame = async (): Promise<GameState> => {
  try {
    const response = await fetch(`${URL}/restartgame`);
    const jsonResp = await response.json();
    const newGameState: GameState = jsonResp as GameState;
    return newGameState;
  } catch (ex) {
    throw new GameError('Unable to call the function restartgame');
  }
};