import { Injectable } from '@nestjs/common';
import { GameState, Graph, Player } from './types';
import { startNewGame, gameState } from './game';
import { checkMoveMarbleInDirection } from './board';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  postStartGame(playerNumber: number): GameState {
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

  getMarblePossibleMoves(): Node[] {
    return;
  }

  putMoveMarble(): GameState {
    return;
  }

  putStopGame() {}
}
