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
import { setGameState } from './game';
import { GameState, Node, Graph } from './types';
import { Game as GameModel } from '@prisma/client';
import { GameService } from './game.service';
import { boardToGraph } from './graph';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gameService: GameService,
  ) {}

  @Post('startgame')
  async createGame(): Promise<GameState> {
    const res = await this.gameService.createGame();
    return this.gameService.bddEntryToGameState(res);
  }

  @Get('gamestate')
  getGameState(): GameState {
    return this.appService.getGameState();
  }

  @Get('restartgame')
  getRestartGame(): GameState {
    return this.appService.restartGame();
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
  postMoveMarble(@Body() body): GameState {
    if (!body.gameState || !body.player || !body.direction) {
      throw new HttpException('Argument is missing', 400);
    }

    const coordinates = {
      x: body.gameState.marbleClicked.x,
      y: body.gameState.marbleClicked.y,
    };

    try {
      return this.appService.moveMarble(
        body.gameState.graph,
        coordinates,
        body.direction,
        body.player,
      );
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post('setgamestate')
  postSetGameState(@Body() body: GameState) {
    return setGameState(body);
  }

  @Put('stopgame')
  putStopGame(): void {}

  @Get('game/:id')
  async getGameById(@Param('id') id: string): Promise<GameState> {
    const res = await this.gameService.getGame({ id: Number(id) });

    return this.gameService.bddEntryToGameState(res);
  }
}
