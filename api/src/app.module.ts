import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { GameStateService } from './gameState/gameState.service';
import { PrismaService } from './prisma.service';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';
import { GameStateModule } from './gameState/gameState.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [AuthModule, UserModule, GameStateModule],
  controllers: [],
  providers: [PrismaService, GameStateService, AppGateway, UserService],
