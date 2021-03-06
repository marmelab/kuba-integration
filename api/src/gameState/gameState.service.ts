import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Game, Prisma } from '@prisma/client';
import {
  GameState,
  Player,
  Graph,
  Node,
  Derivation,
  Board,
  Edge,
} from '../types';
import { INITIAL_BOARD, INVERSE_DIRECTION, ALPHABET } from '../constants';
import { CantMoveError, UserPositionError } from 'src/error';
import { AppGateway } from 'src/app.gateway';

@Injectable()
export class GameStateService {
  constructor(
    private prisma: PrismaService,
    private gatewayService: AppGateway,
  ) {}

  async getGame(
    userWhereUniqueInput: Prisma.GameWhereUniqueInput,
  ): Promise<Game | null> {
    return this.prisma.game.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async getGames(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GameWhereUniqueInput;
    where?: Prisma.GameWhereInput;
    orderBy?: Prisma.GameOrderByWithAggregationInput;
  }): Promise<{ data: Game[]; total: number }> {
    const { skip, take, cursor, where, orderBy } = params;
    const data = await this.prisma.game.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    const total = await this.prisma.game.count({ where });
    return { data, total };
  }

  async createGame(playerId: number): Promise<Game> {
    const newGameState: GameState = this.createNewGameState();
    const newBoard = this.graphToBoard(newGameState.graph);
    const data = {
      board: JSON.stringify(newBoard),
      lastMoves: JSON.stringify(newGameState.lastMoves),
      currentPlayerId: playerId,
      players: JSON.stringify([
        {
          playerId,
          playerNumber: 1,
          marbleColor: 1,
          marblesWon: [],
        },
      ]),
      winnerId: null,
      started: true,
      creationDate: new Date(Date.now()).toISOString(),
      lastMoveDate: new Date(Date.now()).toISOString(),
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

  async deleteGame(where: Prisma.GameWhereUniqueInput): Promise<{ data: any }> {
    const deletedGame = await this.prisma.game.delete({
      where,
    });
    return { data: deletedGame };
  }

  async deleteManyGame(ids: number[]) {
    const deletedGames = await this.prisma.game.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return { data: [deletedGames] };
  }

  deserializerGame(entry: Game): Game {
    entry.board = JSON.parse(entry.board as string);
    entry.players = JSON.parse(entry.players as string);
    entry.marbleClicked = JSON.parse(entry.marbleClicked as string);
    return entry;
  }

  deserializerGameState(entry: Game): GameState {
    try {
      const board = JSON.parse(entry.board as string);
      const lastMoves = JSON.parse(entry.lastMoves as string);
      const graph = this.boardToGraph(board);
      const players = JSON.parse(entry.players as string);
      const marbleClicked = JSON.parse(entry.marbleClicked as string);

      const gameState: GameState = {
        id: entry.id,
        graph,
        board,
        lastMoves,
        currentPlayerId: entry.currentPlayerId,
        players,
        marbleClicked,
        directionSelected: entry.directionSelected,
        winnerId: entry.winnerId,
        started: entry.started,
        creationDate: entry.creationDate,
        lastMoveDate: entry.lastMoveDate,
      };
      return gameState;
    } catch (error) {
      console.error(`parsing DB query result incident => `, error);
    }
  }

  serializer(gameState: GameState): Prisma.GameUpdateInput {
    const game: Game = {
      id: gameState.id,
      board: JSON.stringify(this.graphToBoard(gameState.graph)),
      lastMoves: JSON.stringify(gameState.lastMoves),
      currentPlayerId: gameState.currentPlayerId,
      players: JSON.stringify(gameState.players),
      marbleClicked: JSON.stringify(gameState.marbleClicked),
      directionSelected: gameState.directionSelected,
      winnerId: gameState.winnerId,
      started: gameState.started,
      creationDate: gameState.creationDate,
      lastMoveDate: gameState.lastMoveDate,
    };

    return game;
  }

  gameState: GameState = {
    id: null,
    graph: null,
    currentPlayerId: null,
    lastMoves: [],
    players: null,
    marbleClicked: null,
    directionSelected: null,
    winnerId: null,
    started: false,
    creationDate: new Date(Date.now()).toISOString(),
    lastMoveDate: new Date(Date.now()).toISOString(),
  };

  startNewGame = (playerNumber: number): GameState => {
    if (this.gameState.started) {
      return this.gameState;
    }

    return this.createNewGameState();
  };

  createNewGameState = (): GameState => {
    let board = INITIAL_BOARD;

    const players: Player[] = [];

    const graph = this.boardToGraph(board);

    this.gameState.graph = graph;
    this.gameState.lastMoves = [];
    this.gameState.lastMoves.push(board);
    this.gameState.players = players;
    this.gameState.currentPlayerId = null;
    this.gameState.marbleClicked = { x: -1, y: -1, value: -1, isExit: false };
    this.gameState.directionSelected = '';
    this.gameState.started = true;

    return this.gameState;
  };

  switchToNextPlayer = (actualPlayerID: number, players: Player[]): number => {
    const index = players.findIndex(
      (player) => player.playerId === actualPlayerID,
    );
    if (index === 1) return players[0].playerId;
    return players[1].playerId;
  };

  getCurrentPlayer = (gameState: GameState): Player => {
    return gameState.players.find(
      (player) => player.playerId === gameState.currentPlayerId,
    );
  };

  getMarbleWonByPlayer = (graph: Graph): number => {
    if (!graph) {
      return -1;
    }

    for (const node of Object.values(graph.nodes)) {
      if (node.isExit && node.value > -1) {
        return node.value;
      }
    }

    return -1;
  };

  checkIfPlayerWon = (player: Player) => {
    let otherPlayerMarbles = 0;
    let neutralMarbles = 0;

    for (const marble of player.marblesWon) {
      if (marble !== player.marbleColor) {
        if (marble === 3) {
          neutralMarbles++;
        } else {
          otherPlayerMarbles++;
        }
      }
    }

    return neutralMarbles === 7 || otherPlayerMarbles === 8;
  };

  async isMarblePlayable(
    id: number,
    direction: string,
    playerId: number,
  ): Promise<Boolean> {
    let serializedGameState: Game;
    try {
      serializedGameState = await this.getGame({ id });
    } catch (error) {
      throw new NotFoundException('Game not found');
    }

    const currentGameState = this.deserializerGameState(serializedGameState);
    const marbleClickedCoordinates = `${currentGameState.marbleClicked.x},${currentGameState.marbleClicked.y}`;
    const player = currentGameState.players.find(
      (player) => player.playerId === playerId,
    );

    try {
      this.checkMoveMarbleInDirection(
        currentGameState,
        marbleClickedCoordinates,
        direction,
        player,
      );

      return true;
    } catch (error) {
      this.gatewayService.emitEvent(currentGameState.id, {
        type: 'error',
        message: error.message,
        data: {playerId: player.playerId}
      });
      return false;
    }
  }

  isOppositeMove = (currentGameState: GameState, coordinates: any, direction: string) => {
    const result = this.moveMarbleInDirection(
      currentGameState.graph,
      coordinates,
      direction,
    );
    const newBoard = this.graphToBoard(result.graph);

    return (currentGameState.lastMoves.length > 2 && (
      JSON.stringify(newBoard) ===
      JSON.stringify(currentGameState.lastMoves[1])
    ));
  }

  async moveMarble(
    id: number,
    coordinates: { x: number; y: number },
    direction: string,
    player: Player,
  ): Promise<GameState> {
    let serializedGameState = await this.getGame({ id });

    const currentGameState = this.deserializerGameState(serializedGameState);
    if (currentGameState.currentPlayerId !== player.playerId) {
      throw new Error('This is the other player turn, please be patient');
    }
    const result = this.moveMarbleInDirection(
      currentGameState.graph,
      coordinates,
      direction,
    );

    this.gatewayService.emitEvent(currentGameState.id, {
      type: 'animatedMarble',
      data: {
        marblesCoordinate: result.marblesCoordinate,
        direction,
        playerId: currentGameState.currentPlayerId,
      },
    });


    const newBoard = this.graphToBoard(result.graph);

    if (currentGameState.lastMoves.length > 2) {
      if (
        JSON.stringify(newBoard) ===
        JSON.stringify(currentGameState.lastMoves[1])
      ) {
        throw new Error(
          'You cannot make the exact opposite of your opponent move',
        );
      } else {
        currentGameState.lastMoves = currentGameState.lastMoves.slice(1);
      }
    }

    const marbleWon = this.getMarbleWonByPlayer(result.graph);
    this.sanitizeGraph(result.graph);

    if (marbleWon > -1) {
      const currentPlayer = this.getCurrentPlayer(currentGameState);
      currentPlayer.marblesWon.push(marbleWon);
      if (this.checkIfPlayerWon(currentPlayer)) {
        currentGameState.winnerId = currentPlayer.playerId;
        this.gatewayService.emitEvent(currentGameState.id, {
          type: 'hasWinner',
          data: { playerWinner: currentPlayer },
        });
      }
    } else {
      currentGameState.currentPlayerId = this.switchToNextPlayer(
        currentGameState.currentPlayerId,
        currentGameState.players,
      );

      this.gatewayService.emitEvent(currentGameState.id, {
        type: 'switchPlayer',
        data: { playerId: currentGameState.currentPlayerId },
      });
    }

    currentGameState.lastMoves.push(this.graphToBoard(currentGameState.graph));
    currentGameState.graph = result.graph;
    currentGameState.lastMoveDate = new Date(Date.now()).toISOString();

    return currentGameState;
  }

  convertStringPositionToCoordinates = (position: string) => {
    return position.split(',');
  }

  checkMoveMarbleInDirection(
    gameState: GameState,
    marblePosition: string,
    direction: string,
    player: Player,
  ): void {

    const currentPlayerId = gameState.currentPlayerId;
    const boardGraph = gameState.graph;
    const existInBoard = this.positionExistsInBoard(boardGraph, marblePosition);
    if (currentPlayerId !== player.playerId) {
      throw new CantMoveError('This is not your turn');
    }

    if (!existInBoard) {
      throw new CantMoveError('This position does not exist in the board');
    }

    const freeSpotBeforeToMove = this.hasFreeSpotBeforeToMove(
      boardGraph,
      marblePosition,
      direction,
    );
    if (!freeSpotBeforeToMove) {
      throw new CantMoveError('No free space before the marble');
    }

    const marbleColor = boardGraph.nodes[marblePosition].value;
    if (!marbleColor) {
      throw new Error('No marble at this position');
    }

    const myMarbleColor = this.isOfMyMarbleColor(player, marbleColor);

    if (!myMarbleColor) {
      throw new CantMoveError(
        "This marble can't be moved because it is not your color",
      );
    }

    const itWillExitAnOwnMarble = this.willExitAnOwnMarble(
      boardGraph,
      marblePosition,
      direction,
    );
    if (itWillExitAnOwnMarble) {
      throw new CantMoveError("You can't exit one of your own marbles");
    } 

    const marbleCoordinate = this.convertStringPositionToCoordinates(marblePosition);
    const itWillBeOppositeMove = this.isOppositeMove(
      gameState,
      {x: +marbleCoordinate[0], y: +marbleCoordinate[1]},
      direction,
    );
    if (itWillBeOppositeMove) {
      throw new CantMoveError("You cannot make the exact opposite of your opponent move");
    }
  }

  positionExistsInBoard(boardGraph: Graph, marblePosition: string): Boolean {
    let node = boardGraph.nodes[marblePosition];
    if (node) return node.value >= 1;
    return !!node;
  }

  hasFreeSpotBeforeToMove(
    boardGraph: Graph,
    marblePosition: string,
    direction: string,
  ): Boolean {
    const basePosition: Node = boardGraph.nodes[marblePosition];

    let hIndex: number = basePosition.x;
    let vIndex: number = basePosition.y;

    const derivation: Derivation = INVERSE_DIRECTION[direction];

    hIndex += derivation.x;
    vIndex += derivation.y;

    return !this.positionExistsInBoard(boardGraph, `${hIndex},${vIndex}`);
  }

  isOfMyMarbleColor(player: Player, marbleColor: number) {
    return player.marbleColor === marbleColor;
  }

  boardToGraph(board: Board): Graph {
    if (board.length < 1) return this.newBlankGraph();

    const verticalLines: number = board.length;
    const horizontalLines: number = board[0].length;

    let graph: Graph = this.newBlankGraph();

    for (let hIndex = -1; hIndex < horizontalLines + 1; hIndex++) {
      for (let vIndex = -1; vIndex < verticalLines + 1; vIndex++) {
        graph = {
          nodes: {
            ...graph.nodes,
            [`${hIndex},${vIndex}`]: this.makeNode(hIndex, vIndex, board),
          },
          edges: [...graph.edges, ...this.makeEdges(hIndex, vIndex)],
        };
      }
    }

    return graph;
  }

  newBlankGraph(): Graph {
    return {
      nodes: {},
      edges: [],
    };
  }
  makeNode = (hIndex: number, vIndex: number, board: Board): Node => ({
    x: hIndex,
    y: vIndex,
    value: this.isAnExit(board, hIndex, vIndex) ? -1 : board[vIndex][hIndex],
    isExit: this.isAnExit(board, hIndex, vIndex),
  });

  makeEdges = (hIndex: number, vIndex: number): Edge[] => [
    {
      from: `${hIndex},${vIndex}`,
      to: `${hIndex - 1},${vIndex}`,
      direction: 'W',
    },
    {
      from: `${hIndex},${vIndex}`,
      to: `${hIndex + 1},${vIndex}`,
      direction: 'E',
    },
    {
      from: `${hIndex},${vIndex}`,
      to: `${hIndex},${vIndex - 1}`,
      direction: 'N',
    },
    {
      from: `${hIndex},${vIndex}`,
      to: `${hIndex},${vIndex + 1}`,
      direction: 'S',
    },
  ];

  isAnExit(board: Board, x: number, y: number) {
    const beforeFirstColumnIndex: number = -1;
    const beforeFirstRowIndex: number = -1;
    const afterLastColumnIndex: number = board[0].length;
    const afterLastRowIndex: number = board.length;

    return (
      x === beforeFirstColumnIndex ||
      y === beforeFirstRowIndex ||
      x === afterLastColumnIndex ||
      y === afterLastRowIndex
    );
  }

  positionToCoordinate(position: string): {
    x: number;
    y: number;
  } {
    if (position.length > 3) {
      throw new UserPositionError('This position is longer than 3 characters');
    }

    const positionSplit = position.split('');

    const x = ALPHABET.indexOf(positionSplit[0]);
    const y = parseInt(positionSplit[1] + positionSplit[2]);

    if (x === -1 || y < 0) {
      throw new UserPositionError('This position is not well formatted');
    }

    return { x, y };
  }

  moveMarbleInDirection(
    graph: Graph,
    marbleCoordinate: { x: number; y: number },
    direction: string,
  ): { graph: Graph; marblesCoordinate?: Node[] } {
    if (!marbleCoordinate || !graph || !direction) {
      return {
        graph: {
          nodes: {},
          edges: [],
        },
      };
    }

    let currentNode =
      graph.nodes[`${marbleCoordinate.x},${marbleCoordinate.y}`];

    if (currentNode.value === 0) {
      return { graph };
    }

    const nodes = [currentNode];
    while (true) {
      const edge = graph.edges.find((edge) => {
        return (
          edge.direction === direction &&
          edge.from === `${currentNode.x},${currentNode.y}`
        );
      });

      if (!edge || !graph.nodes[edge.to]) {
        break;
      }

      currentNode = graph.nodes[edge.to];
      nodes.push(currentNode);

      if (currentNode.value == 0) {
        break;
      }
    }

    let previousValue = 0;
    nodes.map((node) => {
      const tmpValue = node.value;
      node.value = previousValue;
      previousValue = tmpValue;
    });

    return { graph, marblesCoordinate: nodes };
  }
  graphToBoard = (graph: Graph): Board => {
    const board: Board = [[]];
    for (const index in graph.nodes) {
      const node: Node = graph.nodes[index];
      if (node.value >= 0) {
        if (!board[node.y]) {
          board.push([]);
        }
        if (node.x >= 0 && node.y >=0)
        board[node.y][node.x] = node.value;
      }
    }
    return board;
  };

  sanitizeGraph = (graph: Graph) => {
    for (const node of Object.values(graph.nodes)) {
      if (node.isExit && node.value > -1) {
        node.value = -1;
      }
    }
  };

  willExitAnOwnMarble = (
    graph: Graph,
    marblePosition: string,
    direction: string,
  ): Boolean => {
    const node = graph.nodes[marblePosition];
    const playerValue = node.value;

    let nodeToSearch = node;
    let exitFound = false;
    let willExitOwnMarble = false;

    while (!exitFound) {
      graph.edges.forEach((edge) => {
        if (
          edge.from === `${nodeToSearch.x},${nodeToSearch.y}` &&
          edge.direction === direction &&
          nodeToSearch.value >= 0
        ) {
          const nextNode = graph.nodes[edge.to];
          if (nextNode.isExit) {
            exitFound = true;
            if (nodeToSearch.value === playerValue) willExitOwnMarble = true;
            return false;
          }
          nodeToSearch = nextNode;
        }
      });
    }
    return willExitOwnMarble;
  };

  restartGame = async (id: number): Promise<GameState> => {
    try {
      const res = await this.updateGame({
        where: { id },
        data: {
          board: JSON.stringify(INITIAL_BOARD),
        },
      });

      this.gatewayService.emitEvent(id, {
        type: 'restart',
      });

      return this.deserializerGameState(res);
    } catch (err) {
      throw new Error('That game does not exist');
    }
  };

  joinGame = async (id: number, playerId: number): Promise<GameState> => {
    try {
      const game = await this.getGame({ id });
      const players = JSON.parse(game.players as string) as Player[];
      const isAlreadyInThisGame = players.find(
        (player) => player.playerId === playerId,
      );

      if (isAlreadyInThisGame) {
        return this.deserializerGameState(game);
      }

      if (players.length >= 2) {
        throw new ForbiddenException('That game as already two player');
      }

      players.push({
        playerId: playerId,
        playerNumber: 2,
        marbleColor: 2,
        marblesWon: [],
      });

      const res = await this.updateGame({
        where: { id },
        data: {
          players: JSON.stringify(players),
        },
      });

      return this.deserializerGameState(res);
    } catch (err) {
      throw new Error(err.message);
    }
  };
}
