import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Admin, Prisma } from '@prisma/client';
const bcrypt = require('bcrypt');
import { saltRounds } from '../auth/constants';
import { ADMIN_TYPE } from 'src/constants';

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) {}

  async getAdmin(
    userWhereUniqueInput: Prisma.AdminWhereUniqueInput,
  ): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async getAdmins(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AdminWhereUniqueInput;
    where?: Prisma.AdminWhereInput;
    orderBy?: Prisma.AdminOrderByWithAggregationInput;
  }): Promise<{ data: Admin[]; total: number }> {
    const { skip, take, cursor, where, orderBy } = params || {};
    const data = await this.prisma.admin.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    const total = await this.prisma.admin.count({ where });
    return { data, total };
  }

  async updateAdmin(params: {
    where: Prisma.AdminWhereUniqueInput;
    data: Prisma.AdminUpdateInput;
  }): Promise<Admin> {
    const { where, data } = params;
    return this.prisma.admin.update({
      data,
      where,
    });
  }

  async deleteAdmin(where: Prisma.AdminWhereUniqueInput): Promise<Admin> {
    return this.prisma.admin.delete({
      where,
    });
  }

  async createAdmin(
    email: string,
    password: string,
    role: string = ADMIN_TYPE.ADMIN,
  ): Promise<Admin> {
    const salt = await bcrypt.genSalt(Number(saltRounds));
    const hash = await bcrypt.hash(password, salt);
    return this.prisma.admin.create({
      data: {
        email,
        hash,
        role: role,
      },
    });
  }
}
