import { IsString, IsOptional } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  company_name: string;

  @IsString()
  @IsOptional()
  contact_info?: string;
}