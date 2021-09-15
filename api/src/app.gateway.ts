import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameState } from './types';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  clients: { gameId: number; wsClient: any }[] = [];

  @WebSocketServer() server;
  @SubscribeMessage('initGame')
  receivedInitGame(client: any, data: any): void {
    if (data.gameId) {
      this.clients.push({ gameId: data.gameId, wsClient: client });
    }
    return;
  }

  emitGameState(gameState: GameState) {
    this.clients.map((client) => {
      if (client.gameId === gameState.id) {
        client.wsClient.send(JSON.stringify({ gameState }));
      }
    });
  }

  afterInit() {
    console.info('init Gateway');
  }

  handleDisconnect() {
    console.info('disconnect Gateway');
  }

  handleConnection() {
    console.info('connect Gateway');
  }
}
