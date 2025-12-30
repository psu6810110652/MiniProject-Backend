import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  category_name: string; // ปรับให้ตรงกับ ER Diagram (snake_case)
}