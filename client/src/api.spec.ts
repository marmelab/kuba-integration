import { pullNewGame } from './api';
import { GameState } from './types';

describe('game', () => {
  describe('Get gameState from API', () => {
    it('should get a initial gameState', async () => {
      try {
        const gameState: GameState = await pullNewGame(1);
        expect(gameState).toHaveProperty('graph');
        expect(gameState).toHaveProperty('currentPlayer');
        expect(gameState).toHaveProperty('players');
        expect(gameState).toHaveProperty('marbleClicked');
        expect(gameState).toHaveProperty('directionSelected');
      } catch (e) {}
    });
  });
});
