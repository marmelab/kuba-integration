import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    const users = await this.userService.getUsers({});
    return users;
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    if (!id) {
      throw new HttpException('Missing parameter', 400);
    }
    const user = await this.userService.getUser({ id });
    return user;
  }

  @Post()
  async createuser(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    if (!email || !password) {
      throw new HttpException("Something's wrong with your credentials ", 400);
    }

    const createdUser = await this.userService.createUser({
      email,
      hash: password,
    });

    return createdUser;
  }

  @Put(':id')
  async putUser(
    @Param('id', ParseIntPipe) id: number,
    @Body('email') email: string,
    @Body('hash') hash: string,
  ) {
    if (!email || !hash) {
      throw new HttpException("Something's wrong with your credentials ", 400);
    }

    const updatedUser = await this.userService.updateUser({
      where: { id },
      data: { email, hash },
    });

    return updatedUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    if (!id) {
      throw new HttpException('Missing parameter', 400);
    }

    const deletedUser = await this.userService.deleteUser({ id });
    console.log(deletedUser);
    return deletedUser;
  }

  @Delete()
  async deleteUsers(@Query('filter') filter: any) {
    if (!filter) {
      throw new HttpException('Missing parameter', 400);
    }

    const deletedUser = await this.userService.deleteManyUser(
      JSON.parse(filter).id,
    );
    return deletedUser;
  }
}
