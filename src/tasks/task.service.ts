import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskDTO } from './dto/tasks.dto';
import { Prisma, TaskState } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(userId: string, taskData: TaskDTO): Promise<TaskDTO> {
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
      progress: taskData.progress,
    };

    const task = await this.prisma.task.create({
      data,
    });

    return task;
  }

  async listUserTasks(userId: string, query: TaskState): Promise<TaskDTO[]> {
    const validate = Object.keys(TaskState).includes(query);

    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        AND: {
          progress: validate ? query : undefined,
        },
      },
    });

    return tasks;
  }
}
