import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  CargoCustomsDocumentEntity,
  ICargoCustomsDocumentRepository,
} from './cargo-customs-document.repository.interface';

@Injectable()
export class CargoCustomsDocumentRepository
  implements ICargoCustomsDocumentRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CargoCustomsDocumentEntity[]> {
    const query = `
      SELECT id, cargo_id, customs_document_type_id, document_number, document_data,
             file_reference, issue_date, expiry_date, is_verified, verified_by, verified_at,
             created_at, updated_at, deleted_at
      FROM cargo_customs_document
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoCustomsDocumentEntity>(query);
  }

  async findById(id: number): Promise<CargoCustomsDocumentEntity | null> {
    const query = `
      SELECT id, cargo_id, customs_document_type_id, document_number, document_data,
             file_reference, issue_date, expiry_date, is_verified, verified_by, verified_at,
             created_at, updated_at, deleted_at
      FROM cargo_customs_document
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CargoCustomsDocumentEntity>(
      query,
      [id],
    );
  }

  async findByCargoId(
    cargoId: number,
  ): Promise<CargoCustomsDocumentEntity[]> {
    const query = `
      SELECT id, cargo_id, customs_document_type_id, document_number, document_data,
             file_reference, issue_date, expiry_date, is_verified, verified_by, verified_at,
             created_at, updated_at, deleted_at
      FROM cargo_customs_document
      WHERE cargo_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoCustomsDocumentEntity>(
      query,
      [cargoId],
    );
  }

  async findByCargoIdAndDocumentTypeId(
    cargoId: number,
    documentTypeId: number,
  ): Promise<CargoCustomsDocumentEntity | null> {
    const query = `
      SELECT id, cargo_id, customs_document_type_id, document_number, document_data,
             file_reference, issue_date, expiry_date, is_verified, verified_by, verified_at,
             created_at, updated_at, deleted_at
      FROM cargo_customs_document
      WHERE cargo_id = $1 AND customs_document_type_id = $2 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CargoCustomsDocumentEntity>(
      query,
      [cargoId, documentTypeId],
    );
  }

  async findByDocumentTypeId(
    documentTypeId: number,
  ): Promise<CargoCustomsDocumentEntity[]> {
    const query = `
      SELECT id, cargo_id, customs_document_type_id, document_number, document_data,
             file_reference, issue_date, expiry_date, is_verified, verified_by, verified_at,
             created_at, updated_at, deleted_at
      FROM cargo_customs_document
      WHERE customs_document_type_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoCustomsDocumentEntity>(
      query,
      [documentTypeId],
    );
  }

  async findByVerified(
    verified: boolean,
  ): Promise<CargoCustomsDocumentEntity[]> {
    const query = `
      SELECT id, cargo_id, customs_document_type_id, document_number, document_data,
             file_reference, issue_date, expiry_date, is_verified, verified_by, verified_at,
             created_at, updated_at, deleted_at
      FROM cargo_customs_document
      WHERE is_verified = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoCustomsDocumentEntity>(
      query,
      [verified],
    );
  }

  async create(
    cargoId: number,
    customsDocumentTypeId: number,
    documentNumber: string | null,
    documentData: Record<string, unknown> | null,
    fileReference: string | null,
    issueDate: Date | null,
    expiryDate: Date | null,
  ): Promise<CargoCustomsDocumentEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<CargoCustomsDocumentEntity> => {
        const insertQuery = `
          INSERT INTO cargo_customs_document 
            (cargo_id, customs_document_type_id, document_number, document_data,
             file_reference, issue_date, expiry_date, is_verified)
          VALUES ($1, $2, $3, $4, $5, $6, $7, false)
          RETURNING id, cargo_id, customs_document_type_id, document_number, document_data,
                    file_reference, issue_date, expiry_date, is_verified, verified_by, verified_at,
                    created_at, updated_at, deleted_at
        `;
        const result = await client.query<CargoCustomsDocumentEntity>(
          insertQuery,
          [
            cargoId,
            customsDocumentTypeId,
            documentNumber,
            documentData ? JSON.stringify(documentData) : null,
            fileReference,
            issueDate,
            expiryDate,
          ],
        );
        return result.rows[0];
      },
    );
  }

  async update(
    id: number,
    documentNumber: string | null,
    documentData: Record<string, unknown> | null,
    fileReference: string | null,
    issueDate: Date | null,
    expiryDate: Date | null,
  ): Promise<CargoCustomsDocumentEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<CargoCustomsDocumentEntity> => {
        const updateQuery = `
          UPDATE cargo_customs_document
          SET document_number = $2,
              document_data = $3,
              file_reference = $4,
              issue_date = $5,
              expiry_date = $6,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING id, cargo_id, customs_document_type_id, document_number, document_data,
                    file_reference, issue_date, expiry_date, is_verified, verified_by, verified_at,
                    created_at, updated_at, deleted_at
        `;
        const result = await client.query<CargoCustomsDocumentEntity>(
          updateQuery,
          [
            id,
            documentNumber,
            documentData ? JSON.stringify(documentData) : null,
            fileReference,
            issueDate,
            expiryDate,
          ],
        );
        if (result.rows.length === 0) {
          throw new Error(`Cargo customs document with id ${id} not found`);
        }
        return result.rows[0];
      },
    );
  }

  async verify(
    id: number,
    verifiedBy: number,
  ): Promise<CargoCustomsDocumentEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<CargoCustomsDocumentEntity> => {
        const verifyQuery = `
          UPDATE cargo_customs_document
          SET is_verified = true,
              verified_by = $2,
              verified_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING id, cargo_id, customs_document_type_id, document_number, document_data,
                    file_reference, issue_date, expiry_date, is_verified, verified_by, verified_at,
                    created_at, updated_at, deleted_at
        `;
        const result = await client.query<CargoCustomsDocumentEntity>(
          verifyQuery,
          [id, verifiedBy],
        );
        if (result.rows.length === 0) {
          throw new Error(`Cargo customs document with id ${id} not found`);
        }
        return result.rows[0];
      },
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.databaseService.transaction(
      async (client: PoolClient): Promise<void> => {
        const deleteQuery = `
          UPDATE cargo_customs_document
          SET deleted_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
        `;
        const result = await client.query(deleteQuery, [id]);
        if (result.rowCount === 0) {
          throw new Error(`Cargo customs document with id ${id} not found`);
        }
      },
    );
  }
}

