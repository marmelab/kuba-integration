import {
  MessageBody,
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
  clients: any[] = [];

  @WebSocketServer() server;
  @SubscribeMessage('initGame')
  receivedInitGame(client: any): void {
    this.clients.push(client);
    return;
  }

  emitGameState(gameState: GameState) {
    this.clients.map((client) => {
      client.send(JSON.stringify({gameState}));
    });
  }

  afterInit() {
    console.log('init Gateway');
  }

  handleDisconnect() {
    console.log('disconnect Gateway');
  }

  handleConnection() {
    console.log('connect Gateway');
  }
}
