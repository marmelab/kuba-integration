import { Player, GameState, GameChoice } from './types';
import { ACCESS_TOKEN, PLAYER_ID } from './index';
import { initGameView, renderGameView } from './blessed';
import { GATEWAY_URL, URL } from './constants';
import { GameError } from './error';
require('isomorphic-fetch');
import * as WebSocket from 'ws';

export const startGame = async (
  numberPlayer: number,
  gameChoice: GameChoice,
) => {
  initGameView();

  let gameState;
  if (gameChoice.type === 'newGame') {
    gameState = await pullNewGame(numberPlayer);
  } else {
    gameState = await pullJoinGame(gameChoice?.gameId, numberPlayer);
  }
  renderGameView(gameState);

  const ws = new WebSocket(GATEWAY_URL);

  ws.on('open', function open() {
    ws.send(
      JSON.stringify({ event: 'initGame', data: { gameId: gameState.id } }),
    );
  });

  ws.on('message', (message) => {
    const newGameState = JSON.parse(message.toString('utf8'))
      .gameState as GameState;
    renderGameView(newGameState);
  });
};

export const pullNewGame = async (playerId: number): Promise<GameState> => {
  try {
    const response = await fetch(`${URL}/games`, {
      method: 'POST',
      body: JSON.stringify({ playerId }),
      headers: getHeaders(),
    });
    const jsonResp = await response.json();
    const gameState: GameState = jsonResp as GameState;
    return gameState;
  } catch (ex) {
    throw new GameError("The game can't be launched");
  }
};

export const pullJoinGame = async (idGame: number, playerId: number): Promise<GameState> => {
  try {
    const response = await fetch(`${URL}/games/${idGame}/join`, {
      method: 'PUT',
      body: JSON.stringify({ playerId }),
      headers: getHeaders(),
    });
    const jsonResp = await response.json();
    const gameState: GameState = jsonResp as GameState;
    return gameState;
  } catch (ex) {
    throw new GameError("The game state can't be loaded");
  }
};

export const pullCanMoveMarblePlayable = async (
  gameState: GameState,
  direction: string,
  player: Player,
): Promise<boolean> => {
  try {
    let response = await fetch(
      `${URL}/games/${gameState.id}/authorized-move?player=${player.playerNumber}&direction=${direction}`,
      { method: 'GET', headers: getHeaders() },
    );
    response = status(response);
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
    let response = await fetch(`${URL}/games/${gameState.id}/move-marble`, {
      method: 'POST',
      body: JSON.stringify({
        coordinates: {
          x: gameState.marbleClicked.x,
          y: gameState.marbleClicked.y,
        },
        direction,
        player,
      }),
      headers: getHeaders(),
    });

    response = status(response);

    const jsonResp = await response.json();
    const gameStateAfterMove: GameState = jsonResp as GameState;
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
      try {
        const newGameState = await moveMarble(gameState, direction, player);
        renderGameView(newGameState);
      } catch (e) {
        console.error("Can't move this marble", e);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export const postMarbleClicked = async (
  gameState: GameState,
): Promise<GameState> => {
  try {
    const response = await fetch(
      `${URL}/games/${gameState.id}/marble-clicked`,
      {
        method: 'PUT',
        body: JSON.stringify({ marbleClicked: gameState.marbleClicked }),
        headers: getHeaders(),
      },
    );

    const jsonResp = await response.json();
    const newGameState: GameState = jsonResp as GameState;

    return newGameState;
  } catch (ex) {
    throw new GameError('Unable to call the function postMarbleClicked');
  }
};

export const postGameState = async (
  gameState: GameState,
): Promise<GameState> => {
  try {
    const response = await fetch(`${URL}/games/${gameState.id}`, {
      method: 'PUT',
      body: JSON.stringify(gameState),
      headers: getHeaders(),
    });

    const jsonResp = await response.json();
    const newGameState: GameState = jsonResp as GameState;

    return newGameState;
  } catch (ex) {
    throw new GameError('Unable to call the function postGameState');
  }
};

export const restartGame = async (gameId: number): Promise<GameState> => {
  try {
    const response = await fetch(`${URL}/games/${gameId}/restart`, {
      method: 'POST',
      headers: getHeaders(),
    });
    const jsonResp = await response.json();
    const newGameState: GameState = jsonResp as GameState;
    return newGameState;
  } catch (ex) {
    throw new GameError('Unable to call the function restartgame');
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<{ access_token: string; id: number; statusCode: number }> => {
  try {
    const response = await fetch(`${URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username: email, password }),
      headers: getHeaders(),
    });

    const jsonResp = await response.json();

    let infos = {
      access_token: jsonResp.access_token as string,
      id: jsonResp.id as number,
      statusCode: response.status,
    };

    return infos;
  } catch (ex) {
    throw new GameError(`Unable to call the function login : ${ex.message}`);
  }
};

const status = (res: Response) => {
  if (!res.ok) {
    throw new GameError(res.statusText);
  }
  return res;
};

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + ACCESS_TOKEN,
  };
};
