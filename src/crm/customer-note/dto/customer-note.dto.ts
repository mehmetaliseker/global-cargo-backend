import {
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CustomerNoteResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  customerId: number;

  @IsString()
  noteText: string;

  @IsString()
  noteType: string;

  @IsOptional()
  @IsNumber()
  createdBy?: number;

  @IsBoolean()
  isPrivate: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}
