export type ActorType = 'customer' | 'employee' | 'partner';

export interface ActorEntity {
  id: number;
  uuid: string;
  actor_type: ActorType;
  email?: string;
  phone?: string;
  address?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IActorRepository {
  findAll(): Promise<ActorEntity[]>;
  findById(id: number): Promise<ActorEntity | null>;
  findByUuid(uuid: string): Promise<ActorEntity | null>;
  findByEmail(email: string): Promise<ActorEntity | null>;
  findByType(actorType: ActorType): Promise<ActorEntity[]>;
  findActive(): Promise<ActorEntity[]>;
  findByTypeAndActive(actorType: ActorType): Promise<ActorEntity[]>;
}

