export interface RouteVisualizationEntity {
    id: number;
    route_id?: number;
    visualization_data: any;
    map_style?: string;
    zoom_level: number;
    created_at: Date;
    updated_at: Date;
}

export interface IRouteVisualizationRepository {
    findAll(): Promise<RouteVisualizationEntity[]>;
    findById(id: number): Promise<RouteVisualizationEntity | null>;
    findByRouteId(routeId: number): Promise<RouteVisualizationEntity[]>;
    findByRouteIdLatest(routeId: number): Promise<RouteVisualizationEntity | null>;
}
