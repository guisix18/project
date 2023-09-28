import {
  Body,
  Controller,
  Res,
  Post,
  Get,
  Req,
  HttpCode,
  HttpStatus,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { Request, Response, response } from 'express';
import { TaskDTO, UpdateTaskDTO } from './dto/tasks.dto';
import { TaskState, User } from '@prisma/client';

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

  @Get()
  @HttpCode(HttpStatus.OK)
  async listUserTasks(
    @Query('progress') query: TaskState,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<TaskDTO[]>> {
    const { id } = request.user as User;

    const userTasks = await this.taskService.listUserTasks(id, query);

    return response.json(userTasks);
  }

  @Patch('/update/:taskId')
  @HttpCode(HttpStatus.OK)
  async updateTaskState(
    @Query('progress') query: TaskState,
    @Param('taskId') taskId: string,
    @Res() response: Response,
  ): Promise<Response<TaskDTO>> {
    const taskUpdate = await this.taskService.updateTaskState(query, taskId);

    return response.json(taskUpdate);
  }

  @Patch('/:taskId')
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @Param('taskId') taskId: string,
    @Res() response: Response,
    @Body() data: UpdateTaskDTO,
  ): Promise<Response<UpdateTaskDTO>> {
    const taskUpdate = await this.taskService.updateTask(data, taskId);

    return response.json(taskUpdate);
  }
}
