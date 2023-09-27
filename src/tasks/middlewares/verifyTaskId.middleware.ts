import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { TASK_NOT_FOUND } from '../utils/tasks.messages';

@Injectable()
export class VerifyTaskIdMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const { taskId } = request.params;

    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
      },
    });

    if (!task) throw new HttpException(TASK_NOT_FOUND, HttpStatus.NOT_FOUND);

    next();
  }
}
