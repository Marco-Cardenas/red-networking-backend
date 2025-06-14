import { IsString, IsArray, IsDateString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  titulo: string;

  @IsArray()
  @IsString({ each: true })
  autores: string[];

  @IsDateString()
  fecha: string;

  @IsArray()
  @IsString({ each: true })
  etiquetas: string[];

  @IsString()
  descripcion: string;

  @IsArray()
  @IsString({ each: true })
  herramientasUtilizadas: string[];

  @IsArray()
  @IsString({ each: true })
  imagenes: string[];

  @IsString()
  @IsOptional()
  documento?: string;
}