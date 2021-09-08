import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import { initializePlayers } from './game';
import { GameState } from './types';
import { GameService } from './game.service';
import { INITIAL_BOARD } from './constants';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gameService: GameService,
  ) {}

  @Get('startgame')
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
  async getRestartGame(@Param('id') id: string): Promise<GameState> {
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
    return this.gameService.deserializer(res);
  }

  @Get('gamestatehaschanged')
  getGameStateHasChanged(@Body() body): boolean {
    return this.appService.hasGameStateChanged(body);
  }

  @Get('marbleplayable')
  getMarblePlayable(@Body() body): Boolean {
    if (!body.gameState || !body.player || !body.direction) {
      throw new HttpException('Argument is missing', 400);
    }
    return this.appService.getIsMarblePlayable(
      body.gameState,
      body.direction,
      body.player,
    );
  }

  @Post('movemarble')
  async postMoveMarble(@Body() body): Promise<GameState> {
    if (!body.gameState || !body.player || !body.direction) {
      throw new HttpException('Argument is missing', 400);
    }

    const coordinates = {
      x: body.gameState.marbleClicked.x,
      y: body.gameState.marbleClicked.y,
    };

    try {
      const newGameState = this.appService.moveMarble(
        body.gameState.graph,
        coordinates,
        body.direction,
        body.player,
      );

      const res = await this.gameService.updateGame({
        where: { id: newGameState.id },
        data: {
          ...this.gameService.serializer(newGameState),
        },
      });

      return newGameState;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post('setgamestate')
  async postSetGameState(@Body() gameState: GameState): Promise<GameState> {
    const res = await this.gameService.updateGame({
      where: { id: gameState.id },
      data: {
        ...this.gameService.serializer(gameState),
      },
    });

    return this.gameService.deserializer(res);
  }

  @Put('stopgame')
  putStopGame(): void {}

  @Get('game/:id')
  async getGameById(@Param('id') id: string): Promise<GameState> {
    const res = await this.gameService.getGame({ id: Number(id) });

    return this.gameService.deserializer(res);
  }
}
