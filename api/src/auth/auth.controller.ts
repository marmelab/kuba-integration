import {
  Controller,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    try {
      return await this.authService.login(req.user);
    } catch (e) {
      console.error(e);
    }
    return req.body;
  }

  @Post('createadmin')
  async createAdmin() {
    try {
      if (await this.userService.getUser({ email: 'adm@mrmlb.com' })) {
        throw new HttpException(
          "this is not the droids you're looking for...",
          400,
        );
      }

      return this.userService.createUser('adm@mrmlb.com', '1234');
    } catch (e) {
      throw new HttpException(
        "this is not the droids you're looking for...",
        400,
      );
    }
  }
}
