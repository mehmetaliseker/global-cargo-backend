export interface RouteRiskScoreEntity {
  id: number;
  route_id: number;
  origin_country_id: number;
  destination_country_id: number;
  risk_level: string;
  risk_score: number;
  minimum_risk_threshold: number;
  updated_at: Date;
  created_at: Date;
}

export interface IRouteRiskScoreRepository {
  findAll(): Promise<RouteRiskScoreEntity[]>;
  findById(id: number): Promise<RouteRiskScoreEntity | null>;
  findByRouteId(routeId: number): Promise<RouteRiskScoreEntity | null>;
  findByOriginCountryId(originCountryId: number): Promise<RouteRiskScoreEntity[]>;
  findByDestinationCountryId(destinationCountryId: number): Promise<RouteRiskScoreEntity[]>;
  findByCountries(
    originCountryId: number,
    destinationCountryId: number,
  ): Promise<RouteRiskScoreEntity[]>;
  findByRiskLevel(riskLevel: string): Promise<RouteRiskScoreEntity[]>;
  create(
    routeId: number,
    originCountryId: number,
    destinationCountryId: number,
    riskLevel: string,
    riskScore: number,
    minimumRiskThreshold: number,
  ): Promise<RouteRiskScoreEntity>;
  update(
    id: number,
    riskLevel: string,
    riskScore: number,
    minimumRiskThreshold: number,
  ): Promise<RouteRiskScoreEntity>;
}

