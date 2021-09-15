import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService, UserService, JwtStrategy],
})
export class UserModule {}
