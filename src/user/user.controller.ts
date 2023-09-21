import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Patch,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserDto, UserUpdateDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(@Res() response: Response): Promise<Response<UserDto[]>> {
    const users = await this.userService.getAllUsers();

    return response.json(users);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<Response<UserDto>> {
    const { id } = request.params;

    const user = await this.userService.getUserById(id);

    return response.json(user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Res() response: Response,
    @Body() data: UserDto,
  ): Promise<Response<UserDto>> {
    const createdUser = await this.userService.createUser(data);

    return response.json(createdUser);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateUser(
    @Res() response: Response,
    @Req() request: Request,
    @Body() data: UserUpdateDTO,
  ): Promise<Response<UserUpdateDTO>> {
    const { id } = request.params;
    const updatedUser = await this.userService.updateUser(id, data);

    return response.json({
      message: 'User updated',
      updatedUser,
    });
  }
}
