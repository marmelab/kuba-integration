import { Graph, Node, Board, Derivation, Player, GameState } from './types';

import { moveMarbleInDirection, willExitAnOwnMarble } from './graph';

import { INVERSE_DIRECTION, INITIAL_BOARD } from './constants';

import { CantMoveError } from './error';
import { gameState } from './game';

enum Mode {
  initial = '1',
  custom = '2',
}

export function getInitialBoard(): Board {
  return INITIAL_BOARD;
}

export function checkMoveMarbleInDirection(
  currentPlayerId: number,
  boardGraph: Graph,
  marblePosition: string,
  direction: string,
  player: Player,
): void {
  const existInBoard = positionExistsInBoard(boardGraph, marblePosition);

  if (currentPlayerId !== player.playerNumber) {
    throw new CantMoveError('This is not your turn');
  }

  if (!existInBoard) {
    throw new CantMoveError('This position does not exist in the board');
  }

  const freeSpotBeforeToMove = hasFreeSpotBeforeToMove(
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

  const myMarbleColor = isOfMyMarbleColor(player, marbleColor);

  if (!myMarbleColor) {
    throw new CantMoveError(
      "This marble can't be moved because it is not your color",
    );
  }

  const itWillExitAnOwnMarble = willExitAnOwnMarble(
    boardGraph,
    marblePosition,
    direction,
  );
  if (itWillExitAnOwnMarble) {
    throw new CantMoveError("You can't exit one of your own marbles");
  }
}

function positionExistsInBoard(
  boardGraph: Graph,
  marblePosition: string,
): Boolean {
  let node = boardGraph.nodes[marblePosition];
  if (node) return node.value >= 1;
  return !!node;
}

function hasFreeSpotBeforeToMove(
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

  return !positionExistsInBoard(boardGraph, `${hIndex},${vIndex}`);
}

function isOfMyMarbleColor(player: Player, marbleColor: number) {
  return player.marbleColor === marbleColor;
}

export function moveMarble(gameState: GameState): Graph {
  const coordinate = {
    x: gameState.marbleClicked?.x,
    y: gameState.marbleClicked?.y,
  };
  const stringCoordinate = `${gameState.marbleClicked?.x},${gameState.marbleClicked?.y}`;
  const canMove = checkMoveMarbleInDirection(
    gameState.currentPlayerId,
    gameState.graph,
    stringCoordinate,
    gameState.directionSelected,
    gameState.players[gameState.currentPlayerId],
  );

  const movedGraph = moveMarbleInDirection(
    gameState.graph,
    coordinate,
    gameState.directionSelected,
  );

  return movedGraph;
}
