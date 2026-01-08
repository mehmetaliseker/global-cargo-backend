import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class EmployeeTrainingResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  employeeId: number;

  @IsString()
  @MaxLength(50)
  trainingLevel: string;

  @IsOptional()
  @IsString()
  competencyCriteria?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  trainingType?: string;

  @IsOptional()
  @IsDateString()
  completionDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  certificateNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  certificateFileReference?: string;

  @IsBoolean()
  isCertified: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class CreateEmployeeTrainingDto {
  @IsNumber()
  employeeId: number;

  @IsString()
  @MaxLength(50)
  trainingLevel: string;

  @IsOptional()
  @IsString()
  competencyCriteria?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  trainingType?: string;

  @IsOptional()
  @IsDateString()
  completionDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  certificateNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  certificateFileReference?: string;

  @IsBoolean()
  isCertified: boolean;
}

export class UpdateEmployeeTrainingDto {
  @IsString()
  @MaxLength(50)
  trainingLevel: string;

  @IsOptional()
  @IsString()
  competencyCriteria?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  trainingType?: string;

  @IsOptional()
  @IsDateString()
  completionDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  certificateNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  certificateFileReference?: string;

  @IsBoolean()
  isCertified: boolean;
}

