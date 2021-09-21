import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from 'src/admins/admins.service';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly adminService: AdminsService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.getUser({ email: email });
    if (user) {
      const resp = await bcrypt.compare(pass, user.hash);
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
      username: user.username,
    };
  }

  async validateAdmin(email: string, pass: string): Promise<any> {
    const admin = await this.adminService.getAdmin({ email: email });
    if (admin) {
      const resp = await bcrypt.compare(pass, admin.hash);
      if (resp) {
        const { hash, ...result } = admin;
        return result;
      }
    }
    return null;
  }

  async adminLogin(admin: any) {
    const payload = { username: admin.email, sub: admin.id };
    return {
      access_token: this.jwtService.sign(payload),
      id: admin.id,
      role: admin.role,
      email: admin.email,
    };
  }
}
