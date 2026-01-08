export interface ContainerCargoAssignmentEntity {
    id: number;
    container_id: number;
    cargo_id: number;
    assigned_date: Date;
    loaded_date?: Date;
    unloaded_date?: Date;
    position_in_container?: string;
    created_at: Date;
    updated_at: Date;
}

export interface IContainerCargoAssignmentRepository {
    findAll(): Promise<ContainerCargoAssignmentEntity[]>;
    findById(id: number): Promise<ContainerCargoAssignmentEntity | null>;
    findByContainerId(containerId: number): Promise<ContainerCargoAssignmentEntity[]>;
    findByCargoId(cargoId: number): Promise<ContainerCargoAssignmentEntity[]>;
}
