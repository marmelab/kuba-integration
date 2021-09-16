import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JWT_CONSTANTS } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { AdminsService } from 'src/admins/admins.service';
@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: JWT_CONSTANTS.secret,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  providers: [
    AuthService,
    UserService,
    AdminsService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
