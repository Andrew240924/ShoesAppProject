import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  groupId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  price: number;

  // конкретный цвет вариации
  @IsString()
  @IsNotEmpty()
  color: string;

  // конкретный размер вариации
  @IsNumber()
  size: number;

  // количество именно этой пары
  @IsNumber()
  stock: number;

  @IsNumber()
  categoryId: number;
}
