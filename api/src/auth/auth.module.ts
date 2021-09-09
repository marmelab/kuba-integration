import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user.module';
import { UserService } from 'src/user.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [PassportModule, UserModule],
  providers: [AuthService, UserService, PrismaService, LocalStrategy],
})
export class AuthModule {}
