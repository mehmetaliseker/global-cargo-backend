import { IsString, IsNumber } from 'class-validator';

export class CountryRiskResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  countryId: number;

  @IsString()
  riskLevel: string;

  @IsNumber()
  riskScore: number;

  @IsString()
  updatedAt: string;

  @IsString()
  deletedAt?: string;
}

