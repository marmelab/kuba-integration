import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import { setGameState } from './game';
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

  @Get('restartgame')
  getRestartGame(): GameState {
    return this.appService.getRestartGame();
  }

  @Post('gamestatehaschanged')
  getGameStateHasChanged(@Body() body): boolean {
    return this.appService.gameStateHasChanged(body);
  }

  @Post('marbleplayable')
  getMarblePlayable(@Body() body): Boolean {
    if (!body.gameState || !body.player || !body.direction) {
      throw new HttpException('Argument is missing', 500);
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
      throw new HttpException('Argument is missing', 500);
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
}
