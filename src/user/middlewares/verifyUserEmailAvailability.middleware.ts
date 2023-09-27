import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_EXISTS } from '../utils/user.messages';

@Injectable()
export class VerifyUserEmailAvailability implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const { email } = request.body;

    const findUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (findUser) throw new HttpException(USER_EXISTS, HttpStatus.BAD_REQUEST);

    next();
  }
}
