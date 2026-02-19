import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
