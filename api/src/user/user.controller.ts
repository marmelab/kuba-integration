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
import { FilterUserPipe, RangePipe, SortPipe } from 'src/custom.pipe';
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(
    @Query('filter', FilterUserPipe) filter: {},
    @Query('sort', SortPipe) sort: {},
    @Query('range', RangePipe) range: {},
  ) {
    const params = { ...filter, ...sort, ...range };
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
    @Body('password') password: string,
  ) {
    if (!email && !password) {
      throw new HttpException('Missing parameter', 400);
    }

    return this.userService.updateUser(id, email, password);
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
