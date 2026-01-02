import { IsString, IsEmail, IsOptional, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

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

  @IsString()
  @IsOptional()
  facebook?: string;

  @IsString()
  @IsOptional()
  twitter?: string;

  @IsString()
  @IsOptional()
  line?: string;

  @IsString()
  @IsOptional()
  facebookName?: string;

  @IsString()
  @IsOptional()
  twitterName?: string;

  @IsString()
  @IsOptional()
  lineName?: string;



  @IsInt()
  @IsOptional()
  points?: number;

  @IsString()
  @IsOptional()
  role?: string; // Defualt to 'user' in service if not provided
}