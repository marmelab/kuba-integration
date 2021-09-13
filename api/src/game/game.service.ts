import { Injectable } from '@nestjs/common';
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

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

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
    const newGameState: GameState = this.createNewGameState();
    const data = {
      board: JSON.stringify(this.graphToBoard(newGameState.graph)),
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
    const graph = this.boardToGraph(board);
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
      board: JSON.stringify(this.graphToBoard(gameState.graph)),
      currentPlayer: gameState.currentPlayerId,
      players: JSON.stringify(gameState.players),
      marbleClicked: JSON.stringify(gameState.marbleClicked),
      directionSelected: gameState.directionSelected,
      hasWinner: gameState.hasWinner,
      started: gameState.started,
    };

    return game;
  }

  gameState: GameState = {
    id: null,
    graph: null,
    currentPlayerId: null,
    players: null,
    marbleClicked: null,
    directionSelected: null,
    hasWinner: false,
    started: false,
  };

  startNewGame = (playerNumber: number): GameState => {
    if (this.gameState.started) {
      return this.gameState;
    }

    return this.createNewGameState();
  };

  createNewGameState = (): GameState => {
    let board = INITIAL_BOARD;

    const players: Player[] = this.initializePlayers();

    const graph = this.boardToGraph(board);

    this.gameState.graph = graph;
    this.gameState.players = players;
    this.gameState.currentPlayerId = players[0].playerNumber;
    this.gameState.marbleClicked = { x: -1, y: -1, value: -1, isExit: false };
    this.gameState.directionSelected = '';
    this.gameState.started = true;

    return this.gameState;
  };

  initializePlayers = () => {
    const player1: Player = {
      playerNumber: 1,
      marbleColor: 1,
      marblesWon: [],
    };

    const player2: Player = {
      playerNumber: 2,
      marbleColor: 2,
      marblesWon: [],
    };

    return [player1, player2];
  };

  switchToNextPlayer = (actualPlayerID: number): number => {
    if (actualPlayerID === 1) return 2;
    return 1;
  };

  getCurrentPlayer = (gameState: GameState): Player => {
    if (gameState.currentPlayerId === 1) return gameState.players[0];
    return gameState.players[0];
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

  isMarblePlayable(
    gameState: GameState,
    direction: string,
    player: Player,
  ): Boolean {
    const marbleClickedCoordinates = `${gameState.marbleClicked.x},${gameState.marbleClicked.y}`;
    try {
      this.checkMoveMarbleInDirection(
        gameState.currentPlayerId,
        gameState.graph,
        marbleClickedCoordinates,
        direction,
        player,
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  async moveMarble(
    id: number,
    graph: Graph,
    coordinates: { x: number; y: number },
    direction: string,
    player: Player,
  ): Promise<GameState> {
    let serializedGameState = await this.getGame({ id });
    const currentGameState = this.deserializer(serializedGameState);

    if (currentGameState.currentPlayerId !== player.playerNumber) {
      throw new Error('This is the other player turn, please be patient');
    }
    const newGraph = this.moveMarbleInDirection(graph, coordinates, direction);
    const marbleWon = this.getMarbleWonByPlayer(newGraph);
    this.sanitizeGraph(newGraph);

    if (marbleWon > -1) {
      currentGameState.players[
        currentGameState.currentPlayerId - 1
      ].marblesWon.push(marbleWon);
      if (
        this.checkIfPlayerWon(
          currentGameState.players[currentGameState.currentPlayerId - 1],
        )
      ) {
        currentGameState.hasWinner = true;
      }
    } else {
      currentGameState.currentPlayerId = this.switchToNextPlayer(
        currentGameState.currentPlayerId,
      );
    }

    currentGameState.graph = newGraph;

    return currentGameState;
  }

  checkMoveMarbleInDirection(
    currentPlayerId: number,
    boardGraph: Graph,
    marblePosition: string,
    direction: string,
    player: Player,
  ): void {
    const existInBoard = this.positionExistsInBoard(boardGraph, marblePosition);

    if (currentPlayerId !== player.playerNumber) {
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
  ): Graph {
    if (!marbleCoordinate || !graph || !direction) {
      return {
        nodes: {},
        edges: [],
      };
    }

    let currentNode =
      graph.nodes[`${marbleCoordinate.x},${marbleCoordinate.y}`];

    if (currentNode.value === 0) {
      return graph;
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

    return graph;
  }
  graphToBoard = (graph: Graph): Board => {
    const board: Board = [[]];
    for (const index in graph.nodes) {
      const node: Node = graph.nodes[index];
      if (node.value >= 0) {
        if (!board[node.y]) {
          board.push([]);
        }
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
}