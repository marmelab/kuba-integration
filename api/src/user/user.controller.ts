import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    await this.userService.getUsers({});
  }

  @Get(':id')
  async getUser(
    @Param('id') id: Prisma.UserWhereUniqueInput,
  ) {
    if (!id) {
      throw new HttpException("Missing parameter", 400);
    }

    await this.userService.getUser(id);
  }

  @Post()
  async createuser(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    if (!email || !password) {
      throw new HttpException("Something's wrong with your credentials ", 400);
    }

    await this.userService.createUser({
      email,
      hash: password,
    });
  }
}
