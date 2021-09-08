import { Injectable } from '@nestjs/common';
import { GameState, Graph, Player } from './types';
import {
  startNewGame,
  gameState,
  switchToNextPlayer,
  setGameState,
} from './game';
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

  hasGameStateChanged(playerGameState: GameState) {
    return JSON.stringify(playerGameState) !== JSON.stringify(gameState);
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
    if (gameState.currentPlayer.playerNumber !== player.playerNumber) {
      throw new Error('This is the other player turn, please be patient');
    }

    return setGameState({
      ...gameState,
      graph: moveMarbleInDirection(graph, coordinates, direction),
      currentPlayer: switchToNextPlayer(
        gameState.currentPlayer,
        gameState.players,
      ),
    });
  }

  putStopGame() {}
}
