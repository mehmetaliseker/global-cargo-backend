import {
  IsString,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class RouteRiskScoreResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  routeId: number;

  @IsNumber()
  originCountryId: number;

  @IsNumber()
  destinationCountryId: number;

  @IsString()
  @MaxLength(50)
  riskLevel: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  riskScore: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  minimumRiskThreshold: number;

  @IsString()
  updatedAt: string;

  @IsString()
  createdAt: string;
}

export class CreateRouteRiskScoreDto {
  @IsNumber()
  @Min(1)
  routeId: number;

  @IsNumber()
  @Min(1)
  originCountryId: number;

  @IsNumber()
  @Min(1)
  destinationCountryId: number;

  @IsString()
  @MaxLength(50)
  riskLevel: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  riskScore: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  minimumRiskThreshold: number;
}

export class UpdateRouteRiskScoreDto {
  @IsString()
  @MaxLength(50)
  riskLevel: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  riskScore: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  minimumRiskThreshold: number;
}

