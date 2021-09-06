import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import { GameState, Node } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('startgame')
  postStartGame(@Body() body): GameState {
    if (!body.playerNumber) {
      throw new HttpException('Argument is missing', 500);
    }
    return this.appService.postStartGame(body.playerNumber);
  }

  @Get('gamestate')
  getGameState(): GameState {
    return this.appService.getGameState();
  }

  @Post('marbleplayable')
  getMarblePlayable(@Body() body): Boolean {
    console.log(body.player)
    if (!body.gameState || !body.player || !body.direction) {
      throw new HttpException('Argument is missing', 500);
    }
    return this.appService.getIsMarblePlayable(body.gameState, body.direction, body.player);
  }

  @Post('movemarble')
  postMoveMarble(): void {}

  @Put('stopgame')
  putStopGame(): void {}
}
