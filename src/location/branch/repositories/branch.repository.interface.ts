export interface BranchEntity {
  id: number;
  uuid: string;
  district_id: number;
  name: string;
  code?: string;
  address?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IBranchRepository {
  findAll(): Promise<BranchEntity[]>;
  findById(id: number): Promise<BranchEntity | null>;
  findByUuid(uuid: string): Promise<BranchEntity | null>;
  findByDistrictId(districtId: number): Promise<BranchEntity[]>;
  findActive(): Promise<BranchEntity[]>;
  findByDistrictIdAndActive(districtId: number): Promise<BranchEntity[]>;
}

