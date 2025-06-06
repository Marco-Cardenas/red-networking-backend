import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({message: 'El nombre es requerido'})
    name: string;

    @IsEmail({}, {message: 'El correo electrónico no es válido'})
    @IsNotEmpty({message: 'El correo electrónico es requerido'})
    email: string;

    @IsString()
    @MinLength(6, {message: 'La contraseña debe tener al menos 6 caracteres'})
    @MaxLength(50, {message: 'La contraseña debe tener menos de 50 caracteres'})
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una mayúscula, una minúscula y un número'
    })
    password: string;

    @IsNotEmpty({message: 'El numero de identificación es requerido'})
    @Matches(
        /^\d+$/, {
        message: 'El numero de identificación debe ser un número'
    })
    identification: string;
    
}


