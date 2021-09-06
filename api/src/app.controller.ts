import { Body, Controller, Get, HttpException, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { GameState, Node } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('startgame')
  postStartGame(@Body() body): GameState {
    return this.appService.postStartGame(body.playernumber);
  }

  @Get('gamestate')
  getGameState(): GameState {
    return this.appService.getGameState();
  }

  @Get('marbleplayable')
    getMarblePlayable(): Boolean {
      // return this.appService.getIsMarblePlayable();
      return false;
    }
  

  @Get('marblepossiblemoves')
    getMarblePossibleMoves() :Node[] {
      return
    }
  
    

  @Put('movemarble')
    putMoveMarble(): void{

    }

  @Put('stopgame')
    putStopGame(): void {

    }

}
