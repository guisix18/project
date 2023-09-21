import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'The password has to be greater or equal than 8' })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, {
    message: 'Password to weak',
  })
  password: string;

  task?: [];
  //Depois de ter feito o DTO, bota como opcional mas em vez de um array vazio bota o DTO
  //TIPO TaskDto
}

export class UserUpdateDTO {
  @IsOptional()
  @IsNotEmpty({ message: "The name field can't be empty" })
  name: string;

  @IsOptional()
  @IsEmail(undefined, { message: 'Email is not valid' })
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(8, { message: 'The password has to be greater or equal than 8' })
  password: string;

  @IsOptional()
  @IsNotEmpty({ message: "The CPF field can't be empty" })
  cpf: string;
}
