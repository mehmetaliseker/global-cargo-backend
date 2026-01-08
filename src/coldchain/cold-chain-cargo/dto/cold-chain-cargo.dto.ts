import {
    IsNumber,
    IsString,
    IsBoolean,
    IsIn,
} from 'class-validator';

export class ColdChainCargoResponseDto {
    @IsNumber()
    id: number;

    @IsNumber()
    cargoId: number;

    @IsNumber()
    requiredTemperatureMin: number;

    @IsNumber()
    requiredTemperatureMax: number;

    @IsString()
    @IsIn(['celsius', 'fahrenheit'])
    temperatureUnit: string;

    @IsString()
    @IsIn(['frozen', 'refrigerated', 'chilled'])
    coldChainType: string;

    @IsBoolean()
    monitoringRequired: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
