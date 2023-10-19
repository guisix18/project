import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupDTO } from './dto/group.dto';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async createGroup(dto: GroupDTO): Promise<GroupDTO> {
    const data: Prisma.GroupTaskCreateInput = {
      id: randomUUID(),
      groupName: dto.groupName,
    };

    const group = await this.prisma.groupTask.create({
      data,
    });

    return group;
  }
}
