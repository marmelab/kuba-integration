import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { JwtService } from '@nestjs/jwt';
import { bcryptSalt, saltRounds } from './constants';
const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.getUser({ email: email });
    if (user) {
      const resp = bcrypt.compare(pass, user.hash);
      if (resp) {
        const { hash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      id: user.id,
    };
  }

  async genSalt(): Promise<string> {
    return await bcrypt.genSalt(Number(saltRounds));
  }

  async hashPassword(pass: string, salt: string): Promise<any> {
    try {
      const salt = await bcrypt.genSalt(Number(saltRounds));
      const hash = await bcrypt.hash(pass, salt);
      return hash;
    } catch (error) {
      console.log(`error in haspass`, error);
    }
  }
}
