import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Query,
  ParseIntPipe,
  Post,
  Put,
  NotFoundException,
  HttpStatus,
  BadRequestException,
  ConflictException,
  // UseGuards,
} from '@nestjs/common';
import { AppGateway } from '../app.gateway';
import { GameState, Player, Node } from '../types';
import { GameStateService } from './gameState.service';
import { Game } from '@prisma/client';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('games')
export class GameStateController {
  constructor(
    private readonly gameStateService: GameStateService,
    private gatewayService: AppGateway,
  ) {}

  @Post('')
  async createGame(): Promise<GameState> {
    const res = await this.gameStateService.createGame();
    return this.gameStateService.deserializer(res);
  }

  @Get('')
  async getGames(): Promise<{ data: Game[] }> {
    try {
      return await this.gameStateService.getGames({});
    } catch (error) {
      throw new NotFoundException('No games was found');
    }
  }

  @Get(':id')
  async getGame(@Param('id', ParseIntPipe) id: number): Promise<Game> {
    try {
      return await this.gameStateService.getGame({ id });
    } catch (error) {
      throw new NotFoundException("That game doesn't exists");
    }
  }

  @Put(':id/join')
  async joinGame(@Param('id', ParseIntPipe) id: number): Promise<GameState> {
    let res: Game;
    try {
      res = await this.gameStateService.getGame({ id });
    } catch (e) {
      throw new NotFoundException("That game doesn't exists");
    }
    const gameState: GameState = this.gameStateService.deserializer(res);
    return gameState;
  }

  @Post(':id/restart')
  async restartGame(@Param('id', ParseIntPipe) id: number): Promise<GameState> {
    let gameState: GameState;
    try {
      gameState = await this.gameStateService.restartGame(id);
    } catch (e) {
      throw new NotFoundException("This game doesn't exists");
    }

    this.gatewayService.emitGameState(gameState);
    return gameState;
  }

  @Put(':id/marble-clicked')
  async setMarbleClicked(
    @Param('id', ParseIntPipe) id: number,
    @Body('marbleClicked') marbleClicked: Node,
  ) {
    let res: Game;
    try {
      res = await this.gameStateService.updateGame({
        where: { id },
        data: {
          marbleClicked: JSON.stringify(marbleClicked),
        },
      });
    } catch (error) {
      throw new HttpException(
        'unable to update the game',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const gameState = this.gameStateService.deserializer(res);
    this.gatewayService.emitGameState(gameState);
    return gameState;
  }

  @Get(':id/authorized-move')
  isAnAuthorizedMove(
    @Param('id', ParseIntPipe) id: number,
    @Query('player', ParseIntPipe) player: number,
    @Query('direction') direction: string,
  ): Promise<Boolean> {
    if (!player || !direction) {
      throw new BadRequestException('Argument is missing');
    }
    return this.gameStateService.isMarblePlayable(id, direction, player);
  }

  @Post(':id/move-marble')
  async moveMarble(
    @Param('id', ParseIntPipe) id: number,
    @Body('coordinates') coordinates: { x: number; y: number },
    @Body('player') player: Player,
    @Body('direction') direction: string,
  ): Promise<GameState> {
    if (!coordinates || !player || !direction) {
      throw new HttpException('Argument is missing', HttpStatus.BAD_REQUEST);
    }

    let newGameState: GameState;

    try {
      newGameState = await this.gameStateService.moveMarble(
        id,
        coordinates,
        direction,
        player,
      );
    } catch (error) {
      throw new ConflictException(error);
    }

    try {
      await this.gameStateService.updateGame({
        where: { id: newGameState.id },
        data: {
          ...this.gameStateService.serializer(newGameState),
        },
      });
    } catch (error) {
      throw new HttpException(
        'unable to update the game',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.gatewayService.emitGameState(newGameState);
    return newGameState;
  }
}
