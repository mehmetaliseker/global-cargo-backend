export interface StateEntity {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  deleted_at?: Date;
}

export interface IStateRepository {
  findAll(): Promise<StateEntity[]>;
  findById(id: number): Promise<StateEntity | null>;
  findByCode(code: string): Promise<StateEntity | null>;
  findActive(): Promise<StateEntity[]>;
}

