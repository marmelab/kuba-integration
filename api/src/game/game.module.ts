import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { AppGateway } from '../app.gateway';
import { GameService } from './game.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [PrismaService, GameService, AppGateway],
})
export class GameModule {}
