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
import { Request, Response, response } from 'express';
import { UserDTO, UserUpdateDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { USER_DEACTIVATE, USER_UPDATED } from './utils/user.messages';
import { isPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @isPublic()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(@Res() response: Response): Promise<Response<UserDTO[]>> {
    const users = await this.userService.getAllUsers();

    return response.json(users);
  }

  @isPublic()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Res() response: Response,
    @Body() data: UserDTO,
  ): Promise<Response<UserDTO>> {
    const createdUser = await this.userService.createUser(data);

    return response.json(createdUser);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<Response<UserDTO>> {
    const { id } = request.params;

    const user = await this.userService.getUserById(id);

    return response.json(user);
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateUser(
    @Res() response: Response,
    @Req() request: Request,
    @Body() data: UserUpdateDTO,
  ): Promise<Response<UserUpdateDTO>> {
    const { id } = request.params;
    const updatedUser = await this.userService.updateUser(id, data);

    return response.json({
      message: USER_UPDATED,
      updatedUser,
    });
  }

  @Patch('/deactivate/:id')
  @HttpCode(HttpStatus.OK)
  async deactivateUser(
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<Response<void>> {
    const { id } = request.params;
    await this.userService.deactivateUser(id);

    return response.json({
      message: USER_DEACTIVATE,
    });
  }
}
