import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
const bcrypt = require('bcrypt');
import { saltRounds } from '../auth/constants';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput;
  }): Promise<{ data: User[]; total: number }> {
    const { skip, take, cursor, where, orderBy } = params || {};
    const data = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    const total = await this.prisma.user.count({ where });
    return { data, total };
  }

  async createUser(
    email: string,
    password: string,
    username: string,
  ): Promise<User> {
    const salt = await bcrypt.genSalt(Number(saltRounds));
    const hash = await bcrypt.hash(password, salt);
    return this.prisma.user.create({
      data: {
        email,
        hash,
        username,
      },
    });
  }

  async updateUser(id: number, email: string, password: string, username: string): Promise<User> {
    const hash = password ? await this.getHash(password) : undefined;
    const params = {
      where: { id } as Prisma.UserWhereUniqueInput,
      data: { email, hash, username } as Prisma.UserUpdateInput,
    };
    return this.prisma.user.update(params);
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async deleteManyUser(ids: number[]) {
    const deletedUsers = await this.prisma.user.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return { data: [deletedUsers] };
  }

  async getHash(password) {
    const salt = await bcrypt.genSalt(Number(saltRounds));
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
