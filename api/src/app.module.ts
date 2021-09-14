import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { GameStateModule } from './gameState/gameState.module';

@Module({
  imports: [GameStateModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
