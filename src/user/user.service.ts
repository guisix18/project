import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDTO } from './dto/user.dto';
import { Prisma, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { select } from './utils/user.select';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<UserDTO[]> {
    const users = await this.prisma.user.findMany({
      select,
    });

    return users;
  }

  async getUserById(id: string): Promise<UserDTO> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
      select,
    });

    return user;
  }

  async createUser(userData: UserDTO): Promise<UserDTO> {
    const data: Prisma.UserCreateInput = {
      id: randomUUID(),
      name: userData.name,
      email: userData.email,
      password: bcrypt.hashSync(userData.password, 10),
    };

    const user = await this.prisma.user.create({
      data,
      select,
    });

    return user;
  }

  async findByEmail(email: string): Promise<UserDTO> {
    return await this.prisma.user.findFirst({
      where: { email },
    });
  }

  async updateUser(id: string, data: UserDTO): Promise<UserDTO> {
    const userUpdated = await this.prisma.user.update({
      where: {
        id,
      },
      data,
      select,
    });

    return userUpdated;
  }

  async deactivateUser(id: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });

    return;
  }
}
