import { Module } from '@nestjs/common';
import { GameStateController } from './gameState.controller';
import { AppGateway } from '../app.gateway';
import { GameStateService } from './gameState.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  controllers: [GameStateController],
  providers: [PrismaService, GameStateService, AppGateway],
})
export class GameStateModule {}
