import { startNewGame } from "./game";

async function main() {
  let numberPlayer;
  if (process.argv.slice(2).length > 0) {
    numberPlayer = process.argv.slice(2)[0];
  } else {
    numberPlayer = 1;
  }
  startNewGame(numberPlayer);
}

main();
