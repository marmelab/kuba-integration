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
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { AppGateway } from '../app.gateway';
import { GameState, Player, Node } from '../types';
import { GameStateService } from './gameState.service';
import { Game } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('games')
export class GameStateController {
  constructor(
    private readonly gameStateService: GameStateService,
    private gatewayService: AppGateway,
  ) {}

  @Post('')
  async createGame(
    @Body('playerId', ParseIntPipe) playerId: number,
  ): Promise<GameState> {
    const res = await this.gameStateService.createGame(playerId);
    return this.gameStateService.deserializerGameState(res);
  }

  @Get('')
  async getGames(): Promise<{ data: Game[] }> {
    try {
      const result = await this.gameStateService.getGames({});
      result.data.map((game) => this.gameStateService.deserializerGame(game));
      return result;
    } catch (error) {
      throw new NotFoundException('No games was found');
    }
  }

  @Get(':id')
  async getGame(@Param('id', ParseIntPipe) id: number): Promise<Game> {
    try {
      const game = await this.gameStateService.getGame({ id });
      return this.gameStateService.deserializerGame(game);
    } catch (error) {
      throw new NotFoundException('That game does not exists');
    }
  }

  @Put(':id/join')
  async joinGame(
    @Param('id', ParseIntPipe) id: number,
    @Body('playerId', ParseIntPipe) playerId: number,
  ): Promise<GameState> {
    try {
      const gameState = await this.gameStateService.joinGame(id, playerId);
      this.gatewayService.emitGameState(gameState);
      return gameState;
    } catch (e) {
      throw new ForbiddenException("Can't join the game");
    }
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
    const gameState = this.gameStateService.deserializerGameState(res);
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
