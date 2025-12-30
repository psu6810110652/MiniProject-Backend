import { IsString, IsNumber, IsInt, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsInt()
  stock_qty: number;

  @IsString()
  category_id: string;

  @IsString()
  supplier_id: string;

  @IsString()
  @IsOptional()
  campaign_id?: string;
}