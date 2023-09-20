import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response, response } from 'express';
import { UserDto } from './dto/user.dto';
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Res() response: Response,
    @Body() data: UserDto,
  ): Promise<Response<UserDto>> {
    const createdUser = await this.userService.createUser(data);

    return response.json(createdUser);
  }
}
