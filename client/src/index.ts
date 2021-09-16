require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});
import { startGame } from './api';
import { renderGameChoice, renderLogin } from './blessed';
require('isomorphic-fetch');
export let PLAYER_ID: number | undefined = null;
export let ACCESS_TOKEN: string | undefined = null;
async function main() {
  const resultLogin = await renderLogin();
  const gameChoice = await renderGameChoice();
  ACCESS_TOKEN = resultLogin.access_token;
  if (resultLogin && gameChoice) {
    try {
      await startGame(resultLogin.id, gameChoice);
    } catch (e) {
      console.error(`Game can't be started: `, e);
    }
  }
}

main();
