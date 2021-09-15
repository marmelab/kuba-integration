import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

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

  async createUser(email: string, password: string): Promise<User> {
    const salt = await this.authService.genSalt();
    const hash = await this.authService.hashPassword(password, salt);
    return this.prisma.user.create({
      data: {
        email,
        hash,
        salt,
      },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async deleteManyUser(ids: number[]) {
    return await this.prisma.user.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }
}
