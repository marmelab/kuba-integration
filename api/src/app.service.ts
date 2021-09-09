import { Injectable } from '@nestjs/common';
import { GameState, Graph, Player } from './types';
import {
  startNewGame,
  gameState,
  switchToNextPlayer,
  getMarbleWonByPlayer,
  checkIfPlayerWon,
} from './game';
import { checkMoveMarbleInDirection } from './board';
import { moveMarbleInDirection, sanitizeGraph } from './graph';
import { GameService } from './game.service';

@Injectable()
export class AppService {
  constructor(private readonly gameService: GameService) {}
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

  async moveMarble(
    id: number,
    graph: Graph,
    coordinates: { x: number; y: number },
    direction: string,
    player: Player,
  ): Promise<GameState> {
    let serializedGameState = await this.gameService.getGame({ id });
    const currentGameState = this.gameService.deserializer(serializedGameState);

    if (currentGameState.currentPlayerId !== player.playerNumber) {
      throw new Error('This is the other player turn, please be patient');
    }
    const newGraph = moveMarbleInDirection(graph, coordinates, direction);
    const marbleWon = getMarbleWonByPlayer(newGraph);
    sanitizeGraph(newGraph);

    if (marbleWon > -1) {
      currentGameState.players[
        currentGameState.currentPlayerId - 1
      ].marblesWon.push(marbleWon);
      if (
        checkIfPlayerWon(
          currentGameState.players[currentGameState.currentPlayerId - 1],
        )
      ) {
        currentGameState.hasWinner = true;
      }
    } else {
      currentGameState.currentPlayerId = switchToNextPlayer(
        currentGameState.currentPlayerId,
      );
    }

    currentGameState.graph = newGraph;

    return currentGameState;
  }

  putStopGame() {}
}
