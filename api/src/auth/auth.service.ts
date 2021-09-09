import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.getUser({ email: email });
    if (user && user.hash === pass) {
      const { hash, ...result } = user;
      return result;
    }
    return null;
  }
}
