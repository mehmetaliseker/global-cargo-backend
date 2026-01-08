import { Injectable, NotFoundException } from '@nestjs/common';
import { DashboardConfigRepository } from '../repositories/dashboard-config.repository';
import { DashboardConfigResponseDto } from '../dto/dashboard-config.dto';
import { DashboardConfigEntity } from '../repositories/dashboard-config.repository.interface';

@Injectable()
export class DashboardConfigService {
    constructor(
        private readonly dashboardConfigRepository: DashboardConfigRepository,
    ) { }

    private mapToDto(entity: DashboardConfigEntity): DashboardConfigResponseDto {
        return {
            id: entity.id,
            uuid: entity.uuid,
            userId: entity.user_id,
            userType: entity.user_type,
            dashboardName: entity.dashboard_name,
            layout: entity.layout,
            isDefault: entity.is_default,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<DashboardConfigResponseDto[]> {
        const entities = await this.dashboardConfigRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<DashboardConfigResponseDto> {
        const entity = await this.dashboardConfigRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Dashboard config with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByUuid(uuid: string): Promise<DashboardConfigResponseDto> {
        const entity = await this.dashboardConfigRepository.findByUuid(uuid);
        if (!entity) {
            throw new NotFoundException(`Dashboard config with uuid ${uuid} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByUserId(userId: number, userType: string): Promise<DashboardConfigResponseDto[]> {
        const entities = await this.dashboardConfigRepository.findByUserId(userId, userType);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findDefaultByUserId(userId: number, userType: string): Promise<DashboardConfigResponseDto | null> {
        const entity = await this.dashboardConfigRepository.findDefaultByUserId(userId, userType);
        if (!entity) {
            return null;
        }
        return this.mapToDto(entity);
    }
}
