import { Body, Controller, Res, Post, Req } from '@nestjs/common';
import { TasksService } from './task.service';
import { Request, Response } from 'express';
import { TaskDTO } from './dto/tasks.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TasksService) {}

  @Post()
  async createTask(
    @Req() request: Request,
    @Res() response: Response,
    @Body() taskData: TaskDTO,
  ): Promise<Response<TaskDTO>> {
    const { user } = request.user;

    const task = await this.taskService.createTask(user.id, taskData);
  }
}
