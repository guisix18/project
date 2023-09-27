import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_NOT_FOUND } from '../utils/user.messages';

@Injectable()
export class VerifyUserIdMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;

    const findUser = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!findUser)
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);

    next();
  }
}
