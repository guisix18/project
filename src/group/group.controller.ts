import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { GroupDTO } from './dto/group.dto';
import { Response } from 'express';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupServices: GroupService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createGroup(
    @Body() data: GroupDTO,
    @Res() response: Response,
  ): Promise<Response<GroupDTO>> {
    const createdGroup = await this.groupServices.createGroup(data);

    return response.json(createdGroup);
  }
}
