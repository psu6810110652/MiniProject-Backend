import { IsString, IsArray, ValidateNested, IsInt, IsNumber } from 'class-validator';
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}