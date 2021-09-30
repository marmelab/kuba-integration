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
  Delete,
  UseGuards,
  Header,
} from '@nestjs/common';
import { AppGateway } from '../app.gateway';
import { GameState, Player, Node } from '../types';
import { GameStateService } from './gameState.service';
import { Game } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilterGamePipe, RangePipe, SortPipe } from 'src/custom.pipe';

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
  @Header('Pragma', 'no-cache')
  async getGames(
    @Query('filter', FilterGamePipe) filter: {},
    @Query('sort', SortPipe) sort: {},
    @Query('range', RangePipe) range: {},
  ): Promise<{ data: Game[] }> {
    const params = { ...filter, ...sort, ...range };
    try {
      const result = await this.gameStateService.getGames(params);
      result.data.map((game) => this.gameStateService.deserializerGame(game));
      return result;
    } catch (error) {
      throw new NotFoundException('No games was found');
    }
  }

  @Get(':id')
  @Header('Pragma', 'no-cache')
  async getGame(@Param('id', ParseIntPipe) id: number): Promise<GameState> {
    const game = await this.gameStateService.getGame({ id });
    return this.gameStateService.deserializerGameState(game);
  }

  @Put(':id/join')
  async joinGame(
    @Param('id', ParseIntPipe) id: number,
    @Body('playerId', ParseIntPipe) playerId: number,
  ): Promise<GameState> {
    const gameState = await this.gameStateService.joinGame(id, playerId);
    this.gatewayService.emitGameState(gameState);
    this.gatewayService.emitEvent(id, {
      type: 'joinGame',
    });
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
    const gameState = this.gameStateService.deserializerGameState(res);
    this.gatewayService.emitGameState(gameState);
    return gameState;
  }

  @Get(':id/authorized-move')
  @Header('Pragma', 'no-cache')
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
      throw new ConflictException(error.message);
    }

    try {
      const gameUpdate = await this.gameStateService.updateGame({
        where: { id: newGameState.id },
        data: {
          ...this.gameStateService.serializer(newGameState),
        },
      });

      this.gatewayService.emitGameState(
        this.gameStateService.deserializerGameState(gameUpdate),
      );
    } catch (error) {
      throw new HttpException(
        'unable to update the game',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return newGameState;
  }

  @Delete(':id')
  async deleteGame(@Param('id', ParseIntPipe) id: number) {
    return this.gameStateService.deleteGame({ id });
  }

  @Delete()
  async deleteManyGame(@Query('filter') filter: any) {
    if (!filter) {
      throw new BadRequestException('Missing parameter');
    }

    return this.gameStateService.deleteManyGame(JSON.parse(filter).id);
  }
}
