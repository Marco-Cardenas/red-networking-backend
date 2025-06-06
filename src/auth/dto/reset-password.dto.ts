import { IsNotEmpty, IsString, MinLength, Matches,  MaxLength} from "class-validator";

export class ResetPasswordDto {
    

    @IsNotEmpty({message: 'El token es requerido'})
    @MinLength(6, {message: 'La contraseña debe tener al menos 6 caracteres'})
    @MaxLength(50, {message: 'La contraseña debe tener menos de 50 caracteres'})
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una mayúscula, una minúscula y un número'
    })
    password: string;

    @IsNotEmpty({message: 'El token es requerido'})
    @IsString()
    token: string;
}


