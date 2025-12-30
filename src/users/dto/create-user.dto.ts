import { IsString, IsEmail, IsOptional, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  address: string;

  @IsInt()
  @IsOptional()
  points?: number;

  @IsString()
  @IsOptional()
  role?: string; // Defualt to 'user' in service if not provided
}