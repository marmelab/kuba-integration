import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
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

    if (filter) {
      try {
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
      } catch (e) {
        throw new HttpException('Incorrect filter parameter', 400);
      }
    }

    if (range) {
      try {
        const rangeNumber = JSON.parse(range) as number[];
        if (rangeNumber) {
          params = {
            ...params,
            take: rangeNumber[1] - rangeNumber[0],
            skip: rangeNumber[0],
          };
        }
      } catch (e) {
        throw new HttpException('Incorrect range parameter', 400);
      }
    }

    if (sort) {
      try {
        const sortParsed = JSON.parse(sort);
        if (sortParsed) {
          params = {
            ...params,
            orderBy: {
              [sortParsed[0]]: sortParsed[1].toLowerCase(),
            },
          };
        }
      } catch (e) {
        throw new HttpException('Incorrect sort parameter', 400);
      }
    }

    const users = await this.userService.getUsers(params);
    return users;
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.userService.getUser({ id });
    } catch (error) {
      throw new NotFoundException("That user doesn't exists");
    }
  }

  @Post()
  async createUser(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('username') username: string,
  ) {
    if (!email || !password || !username) {
      throw new HttpException("Something's wrong with your credentials ", 400);
    }
    return this.userService.createUser(email, password, username);
  }

  @Put(':id')
  async putUser(
    @Param('id', ParseIntPipe) id: number,
    @Body('email') email: string,
    @Body('username') username: string,
  ) {
    if (!email || !username) {
      throw new HttpException('Missing parameter', 400);
    }

    return this.userService.updateUser({
      where: { id },
      data: { email, username },
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    if (!id) {
      throw new HttpException('Missing parameter', 400);
    }

    return this.userService.deleteUser({ id });
  }

  @Delete()
  async deleteUsers(@Query('filter') filter: any) {
    if (!filter) {
      throw new HttpException('Missing parameter', 400);
    }

    return this.userService.deleteManyUser(JSON.parse(filter).id);
  }
}
