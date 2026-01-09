import { IsString, IsEmail, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsBoolean()
  @IsOptional()
  isBlacklisted?: boolean;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  house_number?: string;

  @IsString()
  @IsOptional()
  sub_district?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  postal_code?: string;





  @IsInt()
  @IsOptional()
  points?: number;

  @IsString()
  @IsOptional()
  role?: string; // Defualt to 'user' in service if not provided
}