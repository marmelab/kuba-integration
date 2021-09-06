import { Injectable } from '@nestjs/common';
import { GameState, Graph, Player, Coordinates } from './types';
import { startNewGame, gameState, switchToNextPlayer } from './game';
import { checkMoveMarbleInDirection } from './board';
import { moveMarbleInDirection } from './graph';

@Injectable()
export class AppService {
  startGame(playerNumber: number): GameState {
    return startNewGame(playerNumber);
  }

  getGameState(): GameState {
    return gameState;
  }

  getIsMarblePlayable(
    gameState: GameState,
    direction: string,
    player: Player,
  ): Boolean {
    const marbleClickedCoordinates = `${gameState.marbleClicked.x},${gameState.marbleClicked.y}`;
    try {
      checkMoveMarbleInDirection(
        gameState.graph,
        marbleClickedCoordinates,
        direction,
        player,
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  moveMarble(
    graph: Graph,
    coordinates: { x: number; y: number },
    direction: string,
    player: Player,
  ): GameState {
    console.log(`postMoveMarble`);

    if (gameState.currentPlayer.playerNumber !== player.playerNumber) {
      throw new Error('This is the other player turn, please be patient');
    }
    const newGraph = moveMarbleInDirection(graph, coordinates, direction);

    const newGameState = { ...gameState };
    newGameState.graph = newGraph;
    newGameState.currentPlayer = switchToNextPlayer(
      gameState.currentPlayer,
      gameState.players,
    );

    return newGameState;
  }

  putStopGame() {}
}
