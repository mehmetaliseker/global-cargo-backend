import {
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsObject,
  Min,
  Max,
} from 'class-validator';

export class CustomerSegmentResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsString()
  segmentCode: string;

  @IsString()
  segmentName: string;

  @IsOptional()
  @IsObject()
  criteria?: Record<string, unknown>;

  @IsNumber()
  priority: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class CustomerSegmentAssignmentResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  customerId: number;

  @IsNumber()
  customerSegmentId: number;

  @IsString()
  assignedDate: string;

  @IsOptional()
  @IsNumber()
  assignedBy?: number;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class CustomerTagResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsString()
  tagName: string;

  @IsOptional()
  @IsString()
  tagColor?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class CustomerTagAssignmentResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  customerId: number;

  @IsNumber()
  customerTagId: number;

  @IsOptional()
  @IsNumber()
  assignedBy?: number;

  @IsString()
  assignedDate: string;
}
