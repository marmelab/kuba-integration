import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { GameStateModule } from './gameState/gameState.module';

@Module({
  imports: [GameStateModule],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
