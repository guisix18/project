import {
  IsDate,
  IsEnum,
  IsInstance,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Progress } from '../interface/task.interface';
import { UserDTO } from 'src/user/dto/user.dto';

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

  @IsDate()
  createdAt?: Date;

  @IsDate()
  concluedAt?: Date;

  @IsEnum(Progress)
  progress?: Progress;

  @IsInstance(UserDTO)
  user?: UserDTO;
}
