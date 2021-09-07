import { startNewGame } from './game';

export let PLAYER_ID: number | undefined = null;
async function main() {
  if (process.argv.slice(2).length > 0) {
    PLAYER_ID = +process.argv.slice(2)[0];
  } else {
    PLAYER_ID = 1;
  }

  try {
    await startNewGame(PLAYER_ID);
  } catch (e) {
    console.log("Game can't be started")
  }
}

main();
