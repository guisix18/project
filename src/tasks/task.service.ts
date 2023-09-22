import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskDTO } from './dto/tasks.dto';
import { $Enums, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Progress } from './interface/task.interface';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(userId: string, taskData: TaskDTO): Promise<TaskDTO | any> {
    const data: Prisma.TaskCreateInput = {
      id: randomUUID(),
      title: taskData.title,
      description: taskData.description,
      createdAt: new Date(),
      user: {
        connect: {
          id: userId,
        },
      },
      progress: taskData.progress as $Enums.TaskState,
    };

    const task = await this.prisma.task.create({
      data,
    });

    console.log(task);

    return task;
  }
}
