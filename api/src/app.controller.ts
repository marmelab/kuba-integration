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
  startGame(@Body() body): GameState {
    if (!body.playerNumber) {
      throw new HttpException('Argument is missing', 500);
    }
    return this.appService.startGame(body.playerNumber);
  }

  @Get('gamestate')
  getGameState(): GameState {
    return this.appService.getGameState();
  }

  @Get('marbleplayable')
  isMarblePlayable(): Boolean {
    // return this.appService.getIsMarblePlayable();
    return false;
  }

  @Post('movemarble')
  moveMarble(): void {}

  @Put('stopgame')
  putStopGame(): void {}
}
