import { Player, GameState, GameChoice } from './types';
import { ACCES_TOKEN, PLAYER_ID } from './index';
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
    gameState = await pullJoinGame(gameChoice?.gameId);
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

export const pullNewGame = async (playerNumber: number): Promise<GameState> => {
  try {
    const response = await fetch(`${URL}/startgame`, {
      method: 'POST',
      body: JSON.stringify({ playerNumber }),
      headers: getHeaders(),
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
    const response = await fetch(`${URL}/gamestate`,  
    {
      method: 'GET',
      headers: getHeaders(),
    });
    const jsonResp = await response.json();
    const gameState: GameState = jsonResp as GameState;
    return gameState;
  } catch (ex) {
    throw new GameError("The game state can't be laoaded");
  }
};

export const pullJoinGame = async (idGame: number): Promise<GameState> => {
  try {
    const response = await fetch(`${URL}/joingame/${idGame}`, 
    {
      method: 'GET',
      headers: getHeaders(),
    });
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
      headers: getHeaders(),
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
    let response = await fetch(`${URL}/marbleplayable`, {
      method: 'POST',
      body: JSON.stringify({ gameState, direction, player }),
      headers: getHeaders(),
    });
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
    let response = await fetch(`${URL}/movemarble`, {
      method: 'POST',
      body: JSON.stringify({ gameState, direction, player }),
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
        console.log("Can't move this marble", e);
      }
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
    const response = await fetch(`${URL}/restartgame/${gameId}`, {
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
): Promise<{acces_token: string, id: number}> => {
  try {
    const response = await fetch(`${URL}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: getHeaders(),
    });

    const jsonResp = await response.json();
    const userLogin: {acces_token: string, id: number} = jsonResp as {acces_token: string, id: number};

    return userLogin;
  } catch (ex) {
    throw new GameError('Unable to call the function login');
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
    'Authorization': 'Bearer ' + ACCES_TOKEN,
  };
};