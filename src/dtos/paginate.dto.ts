import {  IsOptional, IsPositive, IsString } from "class-validator";
import { Type } from "class-transformer";

export class PaginationDto {
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    page: number = 1;

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit: number = 10;

    @IsOptional()
    @IsString()
    @Type(() => String)
    search?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    status?: string;

    @IsOptional()
    @Type(() => String)
    get_data?: string = 'false';

}