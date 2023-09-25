import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDTO } from './dto/user.dto';
import { Prisma, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { select } from './utils/user.select';
import { UserPayload } from 'src/auth/models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import Mailgen from 'mailgen';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { SendMailOptions } from 'nodemailer';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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

  private createEmailBody(user: UserDTO) {
    const mailGen = new Mailgen({
      theme: 'default',
      product: {
        name: 'Reset Password',
        link: '',
      },
    });

    const emailBody = {
      body: {
        name: user.name,
        intro: 'Reset your password',
        action: {
          instructions:
            'Para que seja possível o reset de senha, por favor, clique no botão abaixo e escreva sua nova senha',
            button: {
              color: '#0099FF',
              text: 'Reset your password here',
              link: 
            }
        },
      },
    };
  }

  async resetPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    const userPayload: UserPayload = {
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      sub: user.id,
    };

    const token = await this.jwtService.signAsync(userPayload);

    const userWithToken = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetToken: token,
      },
    });

    await this.createEmailBody(userWithToken);
  }
}
