import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const admin = await this.authService.validateAdmin(username, password);
    if (admin) return admin;

    const user = await this.authService.validateUser(username, password);
    if (user) return user;

    if (!user) {
      throw new UnauthorizedException('Vraiment pas authorisé');
    }
  }
}
