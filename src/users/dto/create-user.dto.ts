import { IsString, IsEmail, IsOptional, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  address: string;

  @IsInt()
  @IsOptional()
  points?: number;
}