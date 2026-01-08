export interface GeoCoordinateEntity {
    id: number;
    entity_type: string;
    entity_id: number;
    latitude: number;
    longitude: number;
    accuracy_meters?: number;
    recorded_at: Date;
    created_at: Date;
}

export interface IGeoCoordinateRepository {
    findAll(): Promise<GeoCoordinateEntity[]>;
    findById(id: number): Promise<GeoCoordinateEntity | null>;
    findByEntity(entityType: string, entityId: number): Promise<GeoCoordinateEntity[]>;
    findByEntityLatest(entityType: string, entityId: number): Promise<GeoCoordinateEntity | null>;
    findByDateRange(startDate: Date, endDate: Date): Promise<GeoCoordinateEntity[]>;
    findByEntityAndDateRange(entityType: string, entityId: number, startDate: Date, endDate: Date): Promise<GeoCoordinateEntity[]>;
}
