import { IsOptional } from "class-validator";
import { LoginDto } from "./login.dto";

export class RegisterDto extends LoginDto {
   
    @IsOptional()
    name: string;
    @IsOptional()
    born: string;
}