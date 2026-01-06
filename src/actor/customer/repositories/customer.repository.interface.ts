export interface CustomerEntity {
  id: number;
  uuid: string;
  actor_id: number;
  first_name: string;
  last_name: string;
  identity_number?: string;
  encrypted_identity_number?: Buffer;
  country_id?: number;
  registration_date: Date;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ICustomerRepository {
  findAll(): Promise<CustomerEntity[]>;
  findById(id: number): Promise<CustomerEntity | null>;
  findByUuid(uuid: string): Promise<CustomerEntity | null>;
  findByActorId(actorId: number): Promise<CustomerEntity | null>;
  findByCountryId(countryId: number): Promise<CustomerEntity[]>;
  findVerified(): Promise<CustomerEntity[]>;
  findByCountryIdAndVerified(countryId: number): Promise<CustomerEntity[]>;
}

