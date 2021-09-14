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
  async getUsers(
    @Query('filter') filter: string,
    @Query('sort') sort: string,
    @Query('range') range: string,
  ) {
    let params;
    const filters = JSON.parse(filter);
    if (filters.email) {
      params = {
        where: {
          email: {
            contains: filters.email,
          },
        },
      };
    }

    const rangeNumber = JSON.parse(range) as number[];
    if (rangeNumber) {
      params = {
        ...params,
        take: rangeNumber[1] - rangeNumber[0],
        skip: rangeNumber[0],
      };
    }

    const sortParsed = JSON.parse(sort);
    if (sortParsed) {
      params = {
        ...params,
        orderBy: {
          [sortParsed[0]]: sortParsed[1].toLowerCase(),
        }
      };
    }
    
    const users = await this.userService.getUsers(params);
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
