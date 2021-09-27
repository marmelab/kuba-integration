import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  HttpException,
  Post,
  Body,
  ForbiddenException,
  UseGuards,
  Header,
} from '@nestjs/common';
import { Admin } from 'src/types';
import { AdminsService } from './admins.service';
import { ADMIN_TYPE } from 'src/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @Header('Pragma', 'no-cache')
  async getAdmin(@Param('id', ParseIntPipe) id: number): Promise<Admin> {
    try {
      return await this.adminsService.getAdmin({ id });
    } catch (error) {
      throw new NotFoundException(`This admin doesn't exists`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @Header('Pragma', 'no-cache')
  async getAdmins(
    @Query('filter') filter: string,
    @Query('sort') sort: string,
    @Query('range') range: string,
  ) {
    let params = {};

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
            take: rangeNumber[1] + 1 - rangeNumber[0],
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

    const admins = await this.adminsService.getAdmins(params);
    return admins;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAdmin(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    if (!email || !password) {
      throw new HttpException("Something's wrong with your credentials ", 400);
    }
    return this.adminsService.createAdmin(email, password);
  }

  @Post('setup-admin')
  async setupAdmin() {
    const superAdmin = await this.adminsService.getAdmin({
      email: 'adm@mrmlb.com',
    });

    if (superAdmin) {
      throw new ForbiddenException(
        "These are not the droïds you're looking for",
      );
    }

    return this.adminsService.createAdmin(
      'adm@mrmlb.com',
      '1234',
      ADMIN_TYPE.SUPER_ADMIN,
    );
  }
}
