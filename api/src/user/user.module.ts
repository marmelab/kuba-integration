import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService, UserService],
})
export class UserModule {}
