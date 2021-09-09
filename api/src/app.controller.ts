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
import { UserService } from './user.service';
import { INITIAL_BOARD } from './constants';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private gatewayService: AppGateway,
  ) {}

  @Post('startgame')
  async createGame(): Promise<GameState> {
    const res = await this.gameService.createGame();
    return this.gameService.deserializer(res);
  }

  @Get('gamestate/:id')
  async getGameState(@Param('id') id: string): Promise<GameState> {
    try {
      const res = await this.gameService.getGame({ id: Number(id) });
      return this.gameService.deserializer(res);
    } catch (e) {
      throw new HttpException("That game id doesn't exists", 400);
    }
  }

  @Post('restartgame/:id')
  async restartGame(@Param('id') id: string): Promise<GameState> {
    if (!Number(id)) {
      throw new HttpException('Please give a valid id', 400);
    }
    try {
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
    } catch (e) {
      throw new HttpException("That game doesn't exists", 400);
    }
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
      const newGameState = await this.appService.moveMarble(
        gameState.id,
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
      throw new HttpException(error, 500);
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

  @Post('createuser')
  async createuser(
    @Body('username') username: string,
    @Body('passhash') passhash: string,
  ) {
    if (!username || !passhash) {
      throw new HttpException("Something's wrong with your credentials ", 400);
    }
  }

  @Post('createadmin')
  async createAdmin() {
    try {
      if (await this.userService.getUser({ email: 'adm@mrmlb.com' })) {
        throw new HttpException(
          "this is not the droids you're looking for...",
          400,
        );
      }
      return this.userService.createUser({
        email: 'adm@mrmlb.com',
        hash: '$2y$10$232.rKLBowZhyb7QxkiJkeSar3lKR4fKL8y/34w2oOM9t.eyUnRUm',
      });
    } catch (e) {
      throw new HttpException(
        "this is not the droids you're looking for...",
        400,
      );
    }
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('hash') hash: string,
  ): Promise<string> {
    console.log(`email`, email);
    console.log(`hash`, hash);
    try {
      const user = await this.userService.getUser({ email });
      if (!user) {
        throw new HttpException(
          "Something's wrong with your credentials ",
          400,
        );
      }

      if (user.hash === hash) {
        return "Well done, you're connected !";
      }
    } catch (e) {
      throw new HttpException("Something's wrong with your credentials ", 400);
    }

    return 'NOK';
  }
}
