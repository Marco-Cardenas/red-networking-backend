
import { IsNotEmpty, IsEmail } from "class-validator";

export class ForgotPasswordDto {
    @IsNotEmpty({message: 'El correo electrónico es requerido'})
    @IsEmail({}, {message: 'El correo electrónico no es válido'})
    email: string;
}


