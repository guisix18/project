import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { TaskState } from '@prisma/client';
import { Transform } from 'class-transformer';

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

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(2000)
  @Transform((a: any) => (a.value === '' ? undefined : +a.value))
  ipp?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  nextPageToken?: string;
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
