import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskDTO, UpdateTaskDTO } from './dto/tasks.dto';
import { Prisma, TaskState } from '@prisma/client';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { INextPageToken } from './interface/tasks-next-page-token.interface';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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

  async listUserTasks(userId: string, filters: TaskDTO): Promise<TaskDTO[]> {
    const validate = Object.keys(TaskState).includes(filters.progress);
    let offset: number = 0;
    let nextPageToken: string | null = null;
    let ipp: number = filters.ipp ? filters.ipp : 20;
    let hasMore: boolean = false;

    const decodedNextPage = this.decodeNextPageToken(filters.nextPageToken);

    if (decodedNextPage) {
      ipp = decodedNextPage.ipp;
      offset = decodedNextPage.offset;
    }

    const tasks = await this.prisma.task.findMany({
      skip: offset,
      take: ipp + 1,
      where: {
        userId,
        AND: {
          progress: validate ? filters.progress : undefined,
        },
      },
    });

    if (tasks.length > ipp) {
      hasMore = true;
      nextPageToken = this.encodeNextPageToken({
        ipp: ipp,
        offset: offset + ipp,
      });
      tasks.pop();
    }

    return tasks;
  }

  async updateTaskState(state: TaskState, taskId: string): Promise<TaskDTO> {
    const validate = Object.keys(TaskState).includes(state);

    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
      },
    });

    const taskUpdated = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        progress: validate ? state : task.progress,
      },
    });

    return taskUpdated;
  }

  async updateTask(
    data: UpdateTaskDTO,
    taskId: string,
  ): Promise<UpdateTaskDTO> {
    const taskUpdated = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data,
    });

    return taskUpdated;
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return;
  }

  private encodeNextPageToken(options: INextPageToken) {
    return this.jwtService.sign(options);
  }

  private decodeNextPageToken(nextPageToken: string) {
    let token: INextPageToken | null = null;
    try {
      if (nextPageToken) {
        token = this.jwtService.decode(nextPageToken) as INextPageToken;
      }
    } catch (err) {
      throw new HttpException('ERROR', 400);
    }
    return token;
  }
}
