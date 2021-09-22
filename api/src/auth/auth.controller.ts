import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  async adminLogin(@Request() req: any) {
    try {
      return await this.authService.adminLogin(req.user);
    } catch (e) {
      console.error(e);
    }
    return req.body;
  }
}
