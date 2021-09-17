const blessed = require('blessed');
import { MARBLE_INT_COLORS } from './constants';
import { login, postMarbleClicked, pullActions, restartGame } from './api';
import { GameChoice, GameState } from './types';
import { PLAYER_ID } from './index';

let SCREEN: any;
let LOGIN_SCREEN: any;
let GAME_CHOICE_SCREEN: any;

export const initGameView = (): void => {
  SCREEN = blessed.screen({
    smartCSR: true,
  });

  SCREEN.title = 'Kuba Konsole';
  SCREEN.key(['escape', 'q', 'C-c'], function (ch: any, key: any) {
    return process.exit(0);
  });

  SCREEN.render();
};

export const renderGameView = (gameState: GameState) => {
  const outerBoard = blessed.box({
    top: 'center',
    left: 'center',
    width: 80,
    height: 40,
  });

  const cardinalEastBox = blessed.box({
    top: '50%',
    left: '90%',
    width: 2,
    height: 1,
    content: '\u25bA',
  });

  cardinalEastBox.on('click', function () {
    actionOnCardinal(gameState, 'E');
  });

  const cardinalWestBox = blessed.box({
    top: '50%',
    left: '10%',
    content: '\u25c4',
    width: 2,
    height: 1,
  });

  cardinalWestBox.on('click', function () {
    actionOnCardinal(gameState, 'W');
  });

  const cardinalSouthBox = blessed.box({
    top: '90%',
    left: '50%',
    content: '\u25bc',
    width: 2,
    height: 1,
  });

  cardinalSouthBox.on('click', function () {
    actionOnCardinal(gameState, 'S');
  });

  const cardinalNorthBox = blessed.box({
    top: '10%',
    left: '50%',
    content: '\u25b2',
    width: 2,
    height: 1,
  });

  cardinalNorthBox.on('click', function () {
    actionOnCardinal(gameState, 'N');
  });

  const gameIdText = blessed.box({
    top: '20%',
    left: '80%',
    tags: true,
    content: `Game : #${gameState.id}`,
  });

  const currentPlayerMarbleColor = gameState.players.find(
    (player) => player.playerNumber === gameState.currentPlayerId,
  ).marbleColor;
  const playerTurnText = blessed.box({
    top: 'center',
    left: '80%',
    tags: true,
    content: `Player turn : \u25CF`,
    style: {
      fg: MARBLE_INT_COLORS[currentPlayerMarbleColor],
    },
  });

  const board = blessed.box({
    top: 'center',
    left: 'center',
    width: 57, //*8
    height: 29, // *4
    tags: true,
    border: {
      type: 'line',
    },
    style: {
      border: {
        fg: 'white',
      },
    },
  });

  const iOrOpponentRed: string =
    PLAYER_ID === gameState.players[0]?.playerNumber
      ? `I (\u001b[31m RED \u001b[0m) have captured `
      : `The opponent (\u001b[31m RED \u001b[0m) has captured `;

  const iOrOpponentBlue: string =
    PLAYER_ID === gameState.players[1]?.playerNumber
      ? `I (\u001b[34m BLUE \u001b[0m) have captured `
      : `The Opponent (\u001b[34m BLUE \u001b[0m) has captured `;

  const nodes = gameState.graph.nodes;
  Object.keys(nodes).forEach((key) => {
    const node = nodes[key];
    if (node.value >= 1 && !node.isExit) {
      let tmpBox = blessed.box({
        top: node.y * 4,
        left: node.x * 8,
        width: 7,
        height: 3,
        content: node.value === 0 ? '' : '{center}\n\u25CF{/center}',
        tags: true,
        style: {
          fg: MARBLE_INT_COLORS[node.value],
          bg:
            gameState.marbleClicked?.x === node.x &&
            gameState.marbleClicked?.y === node.y
              ? 'yellow'
              : '',
        },
      });
      tmpBox.on('click', async function () {
        gameState.marbleClicked = node;
        renderGameView(gameState);
        if (PLAYER_ID === gameState.currentPlayerId) {
          await postMarbleClicked(gameState);
        }
      });
      board.append(tmpBox);
    }
  });

  const restartGameBox = blessed.box({
    top: 0,
    left: 75,
    height: 3,
    width: 20,
    tags: true,
    content: '{center}Restart Game{/center}',
    border: {
      type: 'line',
    },
    style: {
      bg: 'red',
      border: {
        fg: 'white',
      },
    },
  });
  restartGameBox.on('click', async () => {
    const newGameState = await restartGame(gameState.id);
    renderGameView(newGameState);
  });

  SCREEN.append(outerBoard);
  outerBoard.append(board);
  outerBoard.append(cardinalEastBox);
  outerBoard.append(cardinalWestBox);
  outerBoard.append(cardinalNorthBox);
  outerBoard.append(cardinalSouthBox);

  if (gameState.players[0]) {
    const playerOneCatchMarblesContainer = blessed.box({
      top: 0,
      left: 0,
      height: 2,
      width: '100%',
      content: iOrOpponentRed,
    });
    let marblesWonByRed = gameState.players[0].marblesWon;

    for (let i = 0; i < marblesWonByRed.length; i++) {
      const marbleBox = blessed.box({
        top: 1,
        left: i * 2,
        width: 1,
        height: 1,
        tags: true,
        style: {
          fg: MARBLE_INT_COLORS[marblesWonByRed[i]],
        },
        content: '{center}\u25CF{/center}',
      });
      playerOneCatchMarblesContainer.append(marbleBox);
    }

    outerBoard.append(playerOneCatchMarblesContainer);
  }

  if (gameState.players[1]) {
    const playerTwoCatchMarblesContainer = blessed.box({
      top: 37,
      left: 0,
      height: 2,
      width: '100%',
      content: iOrOpponentBlue,
    });

    let marblesWonByBlue = gameState.players[1].marblesWon;

    for (let i = 0; i < marblesWonByBlue.length; i++) {
      const marbleBox = blessed.box({
        top: 1,
        left: i * 2,
        width: 1,
        height: 1,
        tags: true,
        style: {
          fg: MARBLE_INT_COLORS[marblesWonByBlue[i]],
        },
        content: '{center}\u25CF{/center}',
      });
      playerTwoCatchMarblesContainer.append(marbleBox);
    }
    outerBoard.append(playerTwoCatchMarblesContainer);
  }

  outerBoard.append(restartGameBox);

  SCREEN.append(gameIdText);
  SCREEN.append(playerTurnText);

  if (gameState.hasWinner) {
    const winnerColor =
      gameState.currentPlayerId === gameState.players[0].playerNumber
        ? `\u001b[31m REDS \u001b[0m`
        : `\u001b[34m BLUES \u001b[0m`;
    const winnerString = `{center}Congratulations to the ${winnerColor} for the nice victory !{/center}`;

    const winBox = blessed.box({
      top: 'center',
      left: 'center',
      width: 70,
      height: 2,
      tags: true,
      content: winnerString,
      style: {
        fg: 'White',
      },
    });

    SCREEN.append(outerBoard);
    outerBoard.append(winBox);
  }

  SCREEN.render();
};

export const renderLogin = (): Promise<{
  access_token: string;
  id: number;
}> => {
  return new Promise((resolve, reject) => {
    try {
      LOGIN_SCREEN = blessed.screen();

      const form = blessed.form({
        parent: LOGIN_SCREEN,
        keys: true,
        left: 'center',
        top: 'center',
        width: 40,
        height: 14,
        border: {
          type: 'line',
        },
        style: {
          border: {
            fg: 'white',
          },
        },
        autoNext: true,
        content: ' Email + password',
      });

      const emailBox = blessed.Textbox({
        parent: form,
        top: 3,
        height: 1,
        left: 2,
        right: 2,
        bg: 'black',
        keys: true,
        inputOnFocus: true,
        content: '',
      });

      const passwordBox = blessed.Textbox({
        parent: form,
        top: 6,
        height: 1,
        left: 2,
        right: 2,
        bg: 'black',
        keys: true,
        inputOnFocus: true,
        content: '',
      });

      const submit = blessed.button({
        parent: form,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
          left: 1,
          right: 1,
        },
        left: 10,
        bottom: 2,
        name: 'submit',
        content: 'submit',
        style: {
          bg: 'blue',
          focus: {
            bg: 'red',
          },
          hover: {
            bg: 'red',
          },
        },
      });

      const cancel = blessed.button({
        parent: form,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
          left: 1,
          right: 1,
        },
        left: 20,
        bottom: 2,
        name: 'cancel',
        content: 'cancel',
        style: {
          bg: 'blue',
          focus: {
            bg: 'red',
          },
          hover: {
            bg: 'red',
          },
        },
      });

      submit.on('press', function () {
        form.submit();
      });

      cancel.on('press', function () {
        form.reset();
      });

      form.on('submit', async () => {
        const email = emailBox.getValue();
        const password = passwordBox.getValue();

        if (email && password) {
          form.setContent('Submitted.');
          LOGIN_SCREEN.render();

          try {
            const resultLogin = await login(email, password);
            if (resultLogin.statusCode === 201) {
              LOGIN_SCREEN.destroy();
              resolve(resultLogin);
            }
          } catch (e) {
            reject(e);
          }
        }
      });

      form.on('reset', function (data) {
        form.setContent('Canceled.');
        LOGIN_SCREEN.render();
      });

      LOGIN_SCREEN.key(['escape', 'q', 'C-c'], () => {
        return process.exit(0);
      });

      emailBox.focus();

      LOGIN_SCREEN.render();
    } catch (err) {
      reject(err);
    }
  });
};

export const renderGameChoice = (): Promise<GameChoice> => {
  return new Promise((resolve, reject) => {
    try {
      GAME_CHOICE_SCREEN = blessed.screen();

      const newGame = blessed.box({
        parent: GAME_CHOICE_SCREEN,
        keys: true,
        left: '10%',
        top: 'center',
        width: 40,
        height: 9,
        border: {
          type: 'line',
        },
        style: {
          border: {
            fg: 'white',
          },
        },
        autoNext: true,
        content: ' New Game',
      });

      blessed.box({
        parent: GAME_CHOICE_SCREEN,
        keys: true,
        left: 'center',
        top: 'center',
        width: 10,
        height: 9,
        autoNext: true,
        tags: true,
        content: '{center}OR{/center}',
      });

      const joinGame = blessed.form({
        parent: GAME_CHOICE_SCREEN,
        keys: true,
        left: '60%',
        top: 'center',
        width: 40,
        height: 9,
        border: {
          type: 'line',
        },
        style: {
          border: {
            fg: 'white',
          },
        },
        autoNext: true,
        content: " Game' ID",
      });

      const newGameButton = blessed.button({
        parent: newGame,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
          left: 1,
          right: 1,
        },
        left: 2,
        bottom: 1,
        name: "Let's go",
        content: "Let's go",
        style: {
          bg: 'blue',
          focus: {
            bg: 'red',
          },
          hover: {
            bg: 'red',
          },
        },
      });

      const gameIDBox = blessed.Textbox({
        parent: joinGame,
        top: 3,
        height: 1,
        left: 2,
        right: 2,
        bg: 'black',
        keys: true,
        inputOnFocus: true,
        mouse: true,
        content: '',
      });

      const joinButton = blessed.button({
        parent: joinGame,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
          left: 1,
          right: 1,
        },
        left: 2,
        bottom: 1,
        name: 'submit',
        content: 'submit',
        style: {
          bg: 'blue',
          focus: {
            bg: 'red',
          },
          hover: {
            bg: 'red',
          },
        },
      });

      newGameButton.on('press', function () {
        GAME_CHOICE_SCREEN.destroy();
        resolve({ type: 'newGame' });
      });

      joinButton.on('press', function () {
        joinGame.submit();
      });

      joinGame.on('submit', async () => {
        const gameId = gameIDBox.getValue();

        if (gameId) {
          GAME_CHOICE_SCREEN.destroy();
          resolve({ type: 'joinGame', gameId });
        } else {
          joinGame.setContent('No game ID submitted');
          GAME_CHOICE_SCREEN.render();
        }
      });

      GAME_CHOICE_SCREEN.key(['escape', 'q', 'C-c'], () => {
        return process.exit(0);
      });

      GAME_CHOICE_SCREEN.render();
    } catch (err) {
      reject(err);
    }
  });
};

const actionOnCardinal = (gameState: GameState, cardinal: any): void => {
  if (PLAYER_ID === gameState.currentPlayerId) {
    pullActions(gameState, cardinal);
    renderGameView(gameState);
  }
};
