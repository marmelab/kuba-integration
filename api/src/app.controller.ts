import { Controller, Get, HttpException, Post, Put } from '@nestjs/common';
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
  startgame(){
    throw new HttpException('Argument is missing', 500)
  }

  @POST('startgame/:playernumber')
  postStartGame('playernumber'): GameState {
    return this.appService.postStartGame()
  }

  @Get('gamestate')
  getGameState(): GameState {
    return
  }

  @Get('marbleplayable')
    getMarblePlayable(): Boolean {
      return this.appService.getIsMarblePlayable();
    }
  

  @Get('marblepossiblemoves')
    getMarblePossibleMoves() :Node[] {
      return
    }
  
    

  @Put('movemarble')
    putMoveMarble(): GameState{

    }

  @Put('stopgame')
    putStopGame(): void {

    }

}
