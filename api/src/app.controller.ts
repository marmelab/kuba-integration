import {
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { GameState, Node } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('startgame')
  startgame() {
    throw new HttpException('Argument is missing', 500);
  }

  @Post('startgame/:playernumber')
  postStartGame(@Param('playernumber') playernumber: number): GameState {
    return this.appService.postStartGame(playernumber);
  }

  @Get('gamestate')
  getGameState(): GameState {
    return;
  }

  @Get('marbleplayable')
  getMarblePlayable(@Req() request: Request): Boolean {
    const params = request.body;

    return this.appService.getIsMarblePlayable();
  }

  @Get('marblepossiblemoves')
  getMarblePossibleMoves(): Node[] {
    return;
  }

  @Post('movemarble')
  postMoveMarble(): GameState {}

  @Put('stopgame')
  putStopGame(): void {}
}
