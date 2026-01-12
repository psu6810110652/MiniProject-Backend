import { IsString, IsNumber, IsInt, IsOptional, IsBoolean } from 'class-validator';

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

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  fandom?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_preorder?: boolean;

  @IsNumber()
  @IsOptional()
  deposit_amount?: number;

  @IsString()
  @IsOptional()
  release_date?: string;

  @IsString()
  @IsOptional()
  gallery?: string; // Expect JSON string

  @IsNumber()
  @IsOptional()
  domestic_shipping_cost?: number;
}