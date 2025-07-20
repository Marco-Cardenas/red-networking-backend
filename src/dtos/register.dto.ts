import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsDateString,
} from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe ser una fecha válida' },
  )
  @IsNotEmpty({ message: 'La fecha de nacimiento es requerida' })
  born: string;
}
