import { Injectable } from '@nestjs/common';
import { GameState, Graph, Player } from './types';
import {
  startNewGame,
  gameState,
  switchToNextPlayer,
  setGameState,
  getMarbleWonByPlayer,
  checkIfPlayerWon,
} from './game';
import { checkMoveMarbleInDirection } from './board';
import { moveMarbleInDirection, sanitizeGraph } from './graph';

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
    if (gameState.currentPlayerId !== player.playerNumber) {
      throw new Error('This is the other player turn, please be patient');
    }
    const newGraph = moveMarbleInDirection(graph, coordinates, direction);
    const marbleWon = getMarbleWonByPlayer(newGraph);
    sanitizeGraph(newGraph);

    if (marbleWon > -1) {
      gameState.players[gameState.currentPlayerId - 1].marblesWon.push(
        marbleWon,
      );
      if (checkIfPlayerWon(gameState.players[gameState.currentPlayerId - 1])) {
        gameState.hasWinner = true;
      }
    } else {
      gameState.currentPlayerId = switchToNextPlayer(gameState.currentPlayerId);
    }

    return setGameState({
      ...gameState,
      graph: newGraph,
    });
  }

  putStopGame() {}
}
