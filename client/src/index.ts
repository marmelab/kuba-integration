require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});
import { startNewGame } from './api';
require('isomorphic-fetch');
export let PLAYER_ID: number | undefined = null;
async function main() {
  console.log(process.env.URL);
  if (process.argv.slice(2).length > 0) {
    PLAYER_ID = +process.argv.slice(2)[0];
  } else {
    PLAYER_ID = 1;
  }

  try {
    await startNewGame(PLAYER_ID);
  } catch (e) {
    console.log("Game can't be started");
  }
}

main();
