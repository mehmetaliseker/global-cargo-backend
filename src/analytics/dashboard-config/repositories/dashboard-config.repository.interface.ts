export interface DashboardConfigEntity {
    id: number;
    uuid: string;
    user_id: number;
    user_type: string;
    dashboard_name: string;
    layout: any;
    is_default: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface IDashboardConfigRepository {
    findAll(): Promise<DashboardConfigEntity[]>;
    findById(id: number): Promise<DashboardConfigEntity | null>;
    findByUuid(uuid: string): Promise<DashboardConfigEntity | null>;
    findByUserId(userId: number, userType: string): Promise<DashboardConfigEntity[]>;
    findDefaultByUserId(userId: number, userType: string): Promise<DashboardConfigEntity | null>;
}
