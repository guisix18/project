import {
  Body,
  Controller,
  Res,
  Post,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { Request, Response } from 'express';
import { TaskDTO } from './dto/tasks.dto';
import { User } from '@prisma/client';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @Req() request: Request,
    @Res() response: Response,
    @Body() taskData: TaskDTO,
  ): Promise<Response<TaskDTO>> {
    const { id } = request.user as User;

    const task = await this.taskService.createTask(id, taskData);

    return response.json(task);
  }
}
