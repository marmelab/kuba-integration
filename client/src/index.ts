require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});
import { startGame } from './api';
import { renderGameChoice, renderLogin } from './blessed';
require('isomorphic-fetch');
export let PLAYER_ID: number | undefined = null;
async function main() {
  if (process.argv.slice(2).length > 0) {
    PLAYER_ID = +process.argv.slice(2)[0];
  } else {
    PLAYER_ID = 1;
  }

  const log = await renderLogin();
  const gameChoice = await renderGameChoice();
  if (log && gameChoice) {
    try {
      await startGame(PLAYER_ID, gameChoice);
    } catch (e) {
      console.log("Game can't be started");
    }
  }
}

main();
