export interface CurrencyEntity {
  id: number;
  code: string;
  name: string;
  symbol?: string;
  is_active: boolean;
  created_at: Date;
  deleted_at?: Date;
}

export interface ICurrencyRepository {
  findAll(): Promise<CurrencyEntity[]>;
  findById(id: number): Promise<CurrencyEntity | null>;
  findByCode(code: string): Promise<CurrencyEntity | null>;
  findActive(): Promise<CurrencyEntity[]>;
}

