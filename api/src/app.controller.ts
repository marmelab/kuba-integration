import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { initializePlayers } from './game';
import { GameState, Player } from './types';
import { GameService } from './game.service';
import { UserService } from './user.service';
import { INITIAL_BOARD } from './constants';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private gatewayService: AppGateway,
    private authService: AuthService,
  ) {}

  // playerNumber
  @UseGuards(JwtAuthGuard)
  @Post('startgame')
  async createGame(): Promise<GameState> {
    const res = await this.gameService.createGame();
    return this.gameService.deserializer(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('gamestate/:id')
  async getGameState(@Param('id') id: string): Promise<GameState> {
    try {
      const res = await this.gameService.getGame({ id: Number(id) });
      return this.gameService.deserializer(res);
    } catch (e) {
      throw new HttpException("That game id doesn't exists", 400);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('joingame/:id')
  async joinGame(@Param('id') id: string): Promise<GameState> {
    try {
      const res = await this.gameService.getGame({ id: Number(id) });
      return this.gameService.deserializer(res);
    } catch (e) {
      throw new HttpException("That game id doesn't exists", 400);
    }
  }

  @UseGuards(JwtAuthGuard)
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
          currentPlayer: 1,
        },
      });
      const gameState = this.gameService.deserializer(res);
      this.gatewayService.emitGameState(gameState);
      return gameState;
    } catch (e) {
      throw new HttpException("That game doesn't exists", 400);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('gamestatehaschanged')
  getGameStateHasChanged(@Body() body: GameState): boolean {
    return this.appService.hasGameStateChanged(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('marbleplayable')
  isMarblePlayable(
    @Body('gameState') gameState: GameState,
    @Body('player') player: Player,
    @Body('direction') direction: string,
  ): Boolean {
    if (!gameState || !player || !direction) {
      throw new HttpException('Argument is missing', 400);
    }
    return this.appService.isMarblePlayable(gameState, direction, player);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Put('stopgame')
  stopGame(): void {}

  @UseGuards(JwtAuthGuard)
  @Get('game/:id')
  async getGameById(@Param('id') id: string): Promise<GameState> {
    const res = await this.gameService.getGame({ id: Number(id) });

    return this.gameService.deserializer(res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('createuser')
  async createuser(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    if (!email || !password) {
      throw new HttpException("Something's wrong with your credentials ", 400);
    }

    await this.userService.createUser({
      email,
      hash: password,
    });
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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
