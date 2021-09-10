import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Game, Prisma } from '@prisma/client';
import { GameState } from './types';
import { createNewGameState } from './game';
import { graphToBoard, boardToGraph } from './graph';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async getGame(
    gameWhereUniqueInput: Prisma.GameWhereUniqueInput,
  ): Promise<Game | null> {
    return this.prisma.game.findUnique({
      where: gameWhereUniqueInput,
    });
  }

  async getGames(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GameWhereUniqueInput;
    where?: Prisma.GameWhereInput;
  }): Promise<Game[]> {
    const { skip, take, cursor, where } = params;
    return this.prisma.game.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  async createGame(): Promise<Game> {
    const newGameState: GameState = createNewGameState();
    const data = {
      board: JSON.stringify(graphToBoard(newGameState.graph)),
      currentPlayer: 1,
      players: JSON.stringify(newGameState.players),
      hasWinner: false,
      started: true,
    };
    return this.prisma.game.create({ data });
  }

  async updateGame(params: {
    where: Prisma.GameWhereUniqueInput;
    data: Prisma.GameUpdateInput;
  }): Promise<Game> {
    const { where, data } = params;
    return this.prisma.game.update({
      data,
      where,
    });
  }

  async deleteGame(where: Prisma.GameWhereUniqueInput): Promise<Game> {
    return this.prisma.game.delete({
      where,
    });
  }

  deserializer(entry: Game): GameState {
    const board = JSON.parse(entry.board as string);
    const graph = boardToGraph(board);
    const players = JSON.parse(entry.players as string);
    const marbleClicked = JSON.parse(entry.marbleClicked as string);

    const gameState: GameState = {
      id: entry.id,
      graph,
      currentPlayerId: entry.currentPlayer,
      players,
      marbleClicked,
      directionSelected: entry.directionSelected,
      hasWinner: entry.hasWinner,
      started: entry.started,
    };
    return gameState;
  }

  serializer(gameState: GameState): Prisma.GameUpdateInput {
    const game: Game = {
      id: gameState.id,
      board: JSON.stringify(graphToBoard(gameState.graph)),
      currentPlayer: gameState.currentPlayerId,
      players: JSON.stringify(gameState.players),
      marbleClicked: JSON.stringify(gameState.marbleClicked),
      directionSelected: gameState.directionSelected,
      hasWinner: gameState.hasWinner,
      started: gameState.started,
    };

    return game;
  }
}
