import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { GameStateModule } from './gameState/gameState.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [GameStateModule, UserModule],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
