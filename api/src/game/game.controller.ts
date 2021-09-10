import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppGateway } from '../app.gateway';
import { GameState, Player } from '../types';
import { GameService } from './game.service';
import { INITIAL_BOARD } from '../constants';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private gatewayService: AppGateway,
  ) {}

  @Post('start')
  async createGame(): Promise<GameState> {
    const res = await this.gameService.createGame();
    return this.gameService.deserializer(res);
  }

  @Get(':id')
  async getGameState(@Param('id') id: string): Promise<GameState> {
    try {
      const res = await this.gameService.getGame({ id: Number(id) });
      return this.gameService.deserializer(res);
    } catch (e) {
      throw new HttpException("That game id doesn't exists", 400);
    }
  }

  @Get('join/:id')
  async joinGame(@Param('id') id: string): Promise<GameState> {
    try {
      const res = await this.gameService.getGame({ id: Number(id) });
      return this.gameService.deserializer(res);
    } catch (e) {
      throw new HttpException("That game id doesn't exists", 400);
    }
  }

  @Post('restart/:id')
  async restartGame(@Param('id') id: string): Promise<GameState> {
    if (!Number(id)) {
      throw new HttpException('Please give a valid id', 400);
    }
    try {
      const clearedPlayers = this.gameService.initializePlayers();
      const res = await this.gameService.updateGame({
        where: { id: Number(id) },
        data: {
          board: JSON.stringify(INITIAL_BOARD),
          players: JSON.stringify(clearedPlayers),
          currentPlayer: 1,
        },
      });
      const gameState = this.gameService.deserializer(res);
      this.gatewayService.emitGameState(gameState);
      return gameState;
    } catch (e) {
      throw new HttpException("That game doesn't exists", 400);
    }
  }

  @Put(':id')
  async setGameState(@Body() gameState: GameState): Promise<GameState> {
    const res = await this.gameService.updateGame({
      where: { id: gameState.id },
      data: {
        ...this.gameService.serializer(gameState),
      },
    });

    this.gatewayService.emitGameState(gameState);
    return this.gameService.deserializer(res);
  }

  @Post('marble/is-playable')
  isMarblePlayable(
    @Body('gameState') gameState: GameState,
    @Body('player') player: Player,
    @Body('direction') direction: string,
  ): Boolean {
    if (!gameState || !player || !direction) {
      throw new HttpException('Argument is missing', 400);
    }
    return this.gameService.isMarblePlayable(gameState, direction, player);
  }

  @Post('marble/move')
  async moveMarble(
    @Body('gameState') gameState: GameState,
    @Body('player') player: Player,
    @Body('direction') direction: string,
  ): Promise<GameState> {
    if (!gameState || !player || !direction) {
      throw new HttpException('Argument is missing', 400);
    }

    const coordinates = {
      x: gameState.marbleClicked.x,
      y: gameState.marbleClicked.y,
    };

    try {
      const newGameState = await this.gameService.moveMarble(
        gameState.id,
        gameState.graph,
        coordinates,
        direction,
        player,
      );

      await this.gameService.updateGame({
        where: { id: newGameState.id },
        data: {
          ...this.gameService.serializer(newGameState),
        },
      });

      this.gatewayService.emitGameState(newGameState);
      return newGameState;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
