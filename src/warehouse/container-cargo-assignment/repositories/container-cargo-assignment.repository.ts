import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    ContainerCargoAssignmentEntity,
    IContainerCargoAssignmentRepository,
} from './container-cargo-assignment.repository.interface';

@Injectable()
export class ContainerCargoAssignmentRepository
    implements IContainerCargoAssignmentRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<ContainerCargoAssignmentEntity[]> {
        const query = `
      SELECT id, container_id, cargo_id, assigned_date, loaded_date,
             unloaded_date, position_in_container, created_at, updated_at
      FROM container_cargo_assignment
      ORDER BY assigned_date DESC
    `;
        return await this.databaseService.query<ContainerCargoAssignmentEntity>(
            query,
        );
    }

    async findById(id: number): Promise<ContainerCargoAssignmentEntity | null> {
        const query = `
      SELECT id, container_id, cargo_id, assigned_date, loaded_date,
             unloaded_date, position_in_container, created_at, updated_at
      FROM container_cargo_assignment
      WHERE id = $1
    `;
        return await this.databaseService.queryOne<ContainerCargoAssignmentEntity>(
            query,
            [id],
        );
    }

    async findByContainerId(
        containerId: number,
    ): Promise<ContainerCargoAssignmentEntity[]> {
        const query = `
      SELECT id, container_id, cargo_id, assigned_date, loaded_date,
             unloaded_date, position_in_container, created_at, updated_at
      FROM container_cargo_assignment
      WHERE container_id = $1
      ORDER BY assigned_date DESC
    `;
        return await this.databaseService.query<ContainerCargoAssignmentEntity>(
            query,
            [containerId],
        );
    }

    async findByCargoId(
        cargoId: number,
    ): Promise<ContainerCargoAssignmentEntity[]> {
        const query = `
      SELECT id, container_id, cargo_id, assigned_date, loaded_date,
             unloaded_date, position_in_container, created_at, updated_at
      FROM container_cargo_assignment
      WHERE cargo_id = $1
      ORDER BY assigned_date DESC
    `;
        return await this.databaseService.query<ContainerCargoAssignmentEntity>(
            query,
            [cargoId],
        );
    }
}
