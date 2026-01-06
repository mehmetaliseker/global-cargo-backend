import { IsString, IsNumber, Min } from 'class-validator';

export class CargoDeliveryPreferenceResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  cargoId: number;

  @IsNumber()
  deliveryOptionId: number;

  @IsNumber()
  @Min(1)
  preferenceOrder: number;

  @IsString()
  createdAt: string;
}

