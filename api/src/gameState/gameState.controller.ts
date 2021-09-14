import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { AppGateway } from '../app.gateway';
import { GameState, Player, Node } from '../types';
import { GameStateService } from './gameState.service';
import { INITIAL_BOARD } from '../constants';
import { Game } from '@prisma/client';

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

  @Get(':id')
  async getGameState(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GameState> {
    let res: Game;
    try {
      res = await this.gameStateService.getGame({ id });
    } catch (error) {
      throw new NotFoundException("That game id doesn't exists");
    }
    return this.gameStateService.deserializer(res);
  }

  @Put(':id/join')
  async joinGame(@Param('id', ParseIntPipe) id: number): Promise<GameState> {
    let res: Game;
    try {
      res = await this.gameStateService.getGame({ id });
    } catch (e) {
      throw new NotFoundException("That game id doesn't exists");
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
      throw new NotFoundException("That game doesn't exists");
    }

    this.gatewayService.emitGameState(gameState);
    return gameState;
  }

  @Put(':id/marbleclicked')
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
      throw new Error('unable to update the game');
    }
    const gameState = this.gameStateService.deserializer(res);
    this.gatewayService.emitGameState(gameState);
    return gameState;
  }

  @Post(':id/authorizedmove')
  isAnAuthorizedMove(
    @Param('id', ParseIntPipe) id: number,
    @Body('marbleClicked') marbleClicked: Node,
    @Body('player') player: Player,
    @Body('direction') direction: string,
  ): Promise<Boolean> {
    if (!marbleClicked || !player || !direction) {
      throw new HttpException('Argument is missing', 400);
    }
    return this.gameStateService.isMarblePlayable(
      id,
      marbleClicked,
      direction,
      player,
    );
  }

  @Post(':id/move')
  async moveMarble(
    @Param('id', ParseIntPipe) id: number,
    @Body('coordinates') coordinates: { x: number; y: number },
    @Body('player') player: Player,
    @Body('direction') direction: string,
  ): Promise<GameState> {
    if (!coordinates || !player || !direction) {
      throw new HttpException('Argument is missing', 400);
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
      throw new HttpException(error, 500);
    }

    try {
      await this.gameStateService.updateGame({
        where: { id: newGameState.id },
        data: {
          ...this.gameStateService.serializer(newGameState),
        },
      });
    } catch (error) {
      throw new Error('unable to update the game');
    }

    this.gatewayService.emitGameState(newGameState);
    return newGameState;
  }
}
