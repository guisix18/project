import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { select } from './utils/user.select';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<UserDto[] | any> {
    const users = await this.prisma.user.findMany({
      select,
    });

    return users;
  }

  async createUser(userData: UserDto): Promise<UserDto> {
    const data: Prisma.UserCreateInput = {
      id: randomUUID(),
      name: userData.name,
      email: userData.email,
      password: bcrypt.hashSync(userData.password, 10),
    };

    const user = await this.prisma.user.create({
      data,
    });

    return {
      ...user,
      password: null,
    };
  }
}
