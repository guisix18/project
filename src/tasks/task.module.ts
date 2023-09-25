import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TasksService } from './task.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaskController],
  providers: [TasksService],
})
export class TaskModule {}
