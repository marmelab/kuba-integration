import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { AppGateway } from '../app.gateway';
import { GameState, Player } from '../types';
import { GameStateService } from './gameState.service';
import { INITIAL_BOARD } from '../constants';

@Controller('games')
export class GameStateController {
  constructor(
    private readonly gameStateService: GameStateService,
    private gatewayService: AppGateway,
  ) {}

  @Post('')
  async createGame(): Promise<GameState> {
    const res = await this.gameStateService.createGame();
    return this.gameStateService.deserializer(res);
  }

  @Get(':id')
  async getGameState(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GameState> {
    try {
      const res = await this.gameStateService.getGame({ id });
      return this.gameStateService.deserializer(res);
    } catch (e) {
      throw new NotFoundException("That game id doesn't exists");
    }
  }

  @Put(':id/join')
  async joinGame(@Param('id', ParseIntPipe) id: number): Promise<GameState> {
    try {
      const res = await this.gameStateService.getGame({ id });
      return this.gameStateService.deserializer(res);
    } catch (e) {
      throw new NotFoundException("That game id doesn't exists");
    }
  }

  @Post(':id/restart')
  async restartGame(@Param('id', ParseIntPipe) id: number): Promise<GameState> {
    try {
      const gameState = await this.gameStateService.restartGame(id);
      this.gatewayService.emitGameState(gameState);
      return gameState;
    } catch (e) {
      throw new NotFoundException("That game doesn't exists");
    }
  }

  @Put(':id')
  async setGameState(@Body() gameState: GameState): Promise<GameState> {
    const res = await this.gameStateService.updateGame({
      where: { id: gameState.id },
      data: {
        ...this.gameStateService.serializer(gameState),
      },
    });

    this.gatewayService.emitGameState(gameState);
    return this.gameStateService.deserializer(res);
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
    return this.gameStateService.isMarblePlayable(gameState, direction, player);
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
      const newGameState = await this.gameStateService.moveMarble(
        gameState.id,
        gameState.graph,
        coordinates,
        direction,
        player,
      );

      await this.gameStateService.updateGame({
        where: { id: newGameState.id },
        data: {
          ...this.gameStateService.serializer(newGameState),
        },
      });

      this.gatewayService.emitGameState(newGameState);
      return newGameState;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
