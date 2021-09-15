import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    const hash = await this.authService.hashPassword(password);
    const user = await this.authService.validateUser(email, hash);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
