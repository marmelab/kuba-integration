import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { initializePlayers } from './game';
import { GameState, Player } from './types';
import { GameService } from './game.service';
import { INITIAL_BOARD } from './constants';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gameService: GameService,
    private gatewayService: AppGateway,
  ) {}

  @Post('startgame')
  async createGame(): Promise<GameState> {
    const res = await this.gameService.createGame();
    return this.gameService.deserializer(res);
  }

  @Get('gamestate/:id')
  async getGameState(@Param('id') id: string): Promise<GameState> {
    const res = await this.gameService.getGame({ id: Number(id) });
    return this.gameService.deserializer(res);
  }

  @Post('restartgame/:id')
  async restartGame(@Param('id') id: string): Promise<GameState> {
    if (!Number(id)) {
      throw new HttpException('Please give a valid id', 400);
    }
    const clearedPlayers = initializePlayers();
    const res = await this.gameService.updateGame({
      where: { id: Number(id) },
      data: {
        board: JSON.stringify(INITIAL_BOARD),
        players: JSON.stringify(clearedPlayers),
      },
    });
    const gameState = this.gameService.deserializer(res);
    this.gatewayService.emitGameState(gameState);
    return gameState;
  }

  @Get('gamestatehaschanged')
  getGameStateHasChanged(@Body() body: GameState): boolean {
    return this.appService.hasGameStateChanged(body);
  }

  @Get('marbleplayable')
  getMarblePlayable(
    @Body('gameState') gameState: GameState,
    @Body('player') player: Player,
    @Body('direction') direction: string,
  ): Boolean {
    if (!gameState || !player || !direction) {
      throw new HttpException('Argument is missing', 400);
    }
    return this.appService.getIsMarblePlayable(gameState, direction, player);
  }

  @Post('movemarble')
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
      const newGameState = this.appService.moveMarble(
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
      throw new HttpException(error.message, 500);
    }
  }

  @Post('setgamestate')
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

  @Put('stopgame')
  stopGame(): void {}

  @Get('game/:id')
  async getGameById(@Param('id') id: string): Promise<GameState> {
    const res = await this.gameService.getGame({ id: Number(id) });

    return this.gameService.deserializer(res);
  }
}
