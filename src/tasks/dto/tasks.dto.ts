import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskState } from '@prisma/client';

export class TaskDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  description: string;

  @IsOptional()
  @IsEnum(TaskState, { each: true })
  progress?: TaskState;
}

export class UpdateTaskDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  description: string;

  @IsOptional()
  @IsEnum(TaskState, { each: true })
  progress?: TaskState;
}
