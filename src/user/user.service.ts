import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDTO } from './dto/user.dto';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { select } from './utils/user.select';
import { UserPayload } from 'src/auth/models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { urlGen } from './utils/user.urlgen';
import { MailerService } from '@nestjs-modules/mailer';
import { EXPIRED_TOKEN, USER_NOT_FOUND } from './utils/user.messages';
import { Request } from 'express';
import { Content } from 'mailgen';
const Mailgen = require('mailgen');

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailer: MailerService,
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
      createdAt: new Date(),
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

  private createEmailBody(user: UserDTO, req: Request) {
    const mailGen = new Mailgen({
      theme: 'default',
      product: {
        name: 'Reset Password',
        link: req.protocol + req.get('Host'),
      },
    });

    const link = urlGen(req).replaceAll('forget-password', 'new-password');

    const emailBody: Content = {
      body: {
        name: user.name,
        intro: 'Reset your password',
        action: {
          instructions:
            'Para que seja possível o reset de senha, por favor, clique no botão abaixo e escreva sua nova senha',
          button: {
            color: '#0099FF',
            text: 'Reset your password here',
            link: `${link}?token=${user.resetToken}`,
          },
        },
        outro: 'Need help? Please, send me a email',
      },
    };

    const email = mailGen.generate(emailBody);

    return email;
  }

  async sendMail(user: UserDTO, req: Request): Promise<void> {
    const htmlToBeSented = this.createEmailBody(user, req);

    await this.mailer.sendMail({
      to: user.email,
      from: 'guisix16@gmail.com',
      subject: 'Reset your password',
      html: htmlToBeSented,
    });

    return;
  }

  async forgetPassword(request: Request, email: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    const userPayload: UserPayload = {
      id: user.id,
      sub: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
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

    await this.sendMail(userWithToken, request);

    return;
  }

  async newPassword(token: string, password: string): Promise<UserDTO> {
    try {
      const decodedToken = this.jwtService.verify(token);

      const user = await this.prisma.user.findFirst({
        where: {
          id: decodedToken.id,
        },
      });

      if (!user) throw new HttpException(USER_NOT_FOUND, 404);

      const userWithNewPass = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: bcrypt.hashSync(password, 10),
          updatedAt: new Date(),
          resetToken: null,
        },
        select,
      });

      return userWithNewPass;
    } catch (err) {
      if (err) {
        throw new HttpException(EXPIRED_TOKEN, 400);
      }
    }
  }
}
