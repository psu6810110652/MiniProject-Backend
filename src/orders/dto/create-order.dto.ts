import { IsString, IsArray, ValidateNested, IsInt, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  product_id: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  unit_price: number;
}

export class CreateOrderDto {
  @IsString()
  user_id: string;

  @IsNumber()
  shipping_fee: number;

  @IsOptional()
  @IsString()
  shipping_address?: string;

  @IsOptional()
  @IsString()
  payment_slip?: string;

  @IsOptional()
  @IsString()
  payment_date?: string;

  @IsOptional()
  @IsString()
  payment_time?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}