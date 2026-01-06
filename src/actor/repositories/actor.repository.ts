import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ActorEntity, IActorRepository, ActorType } from './actor.repository.interface';

@Injectable()
export class ActorRepository implements IActorRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<ActorEntity[]> {
    const query = `
      SELECT id, uuid, actor_type, email, phone, address, is_active, created_at, updated_at, deleted_at
      FROM actor
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<ActorEntity>(query);
  }

  async findById(id: number): Promise<ActorEntity | null> {
    const query = `
      SELECT id, uuid, actor_type, email, phone, address, is_active, created_at, updated_at, deleted_at
      FROM actor
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<ActorEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<ActorEntity | null> {
    const query = `
      SELECT id, uuid, actor_type, email, phone, address, is_active, created_at, updated_at, deleted_at
      FROM actor
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<ActorEntity>(query, [uuid]);
  }

  async findByEmail(email: string): Promise<ActorEntity | null> {
    const query = `
      SELECT id, uuid, actor_type, email, phone, address, is_active, created_at, updated_at, deleted_at
      FROM actor
      WHERE email = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<ActorEntity>(query, [email]);
  }

  async findByType(actorType: ActorType): Promise<ActorEntity[]> {
    const query = `
      SELECT id, uuid, actor_type, email, phone, address, is_active, created_at, updated_at, deleted_at
      FROM actor
      WHERE actor_type = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<ActorEntity>(query, [actorType]);
  }

  async findActive(): Promise<ActorEntity[]> {
    const query = `
      SELECT id, uuid, actor_type, email, phone, address, is_active, created_at, updated_at, deleted_at
      FROM actor
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<ActorEntity>(query);
  }

  async findByTypeAndActive(actorType: ActorType): Promise<ActorEntity[]> {
    const query = `
      SELECT id, uuid, actor_type, email, phone, address, is_active, created_at, updated_at, deleted_at
      FROM actor
      WHERE actor_type = $1 AND is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<ActorEntity>(query, [actorType]);
  }
}

