import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { GameService } from './game.service';
import { PrismaService } from './prisma.service';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, GameService, AppGateway, UserService],
})
export class AppModule {}
