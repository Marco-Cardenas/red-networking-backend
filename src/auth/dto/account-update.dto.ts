        
import {  IsEmail, IsNotEmpty, IsOptional,  } from "class-validator";

export class AccountUpdateDto {
    @IsOptional()
    password: string;
    @IsOptional()
    password_current: string;
    @IsEmail({}, {message: 'El correo electrónico no es válido'})
    @IsNotEmpty({message: 'El correo electrónico es requerido'})
    email: string;
   
}


