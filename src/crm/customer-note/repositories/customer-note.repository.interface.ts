export interface CustomerNoteEntity {
  id: number;
  customer_id: number;
  note_text: string;
  note_type: string;
  created_by?: number;
  is_private: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ICustomerNoteRepository {
  findAll(): Promise<CustomerNoteEntity[]>;
  findById(id: number): Promise<CustomerNoteEntity | null>;
  findByCustomerId(customerId: number): Promise<CustomerNoteEntity[]>;
  findByNoteType(noteType: string): Promise<CustomerNoteEntity[]>;
  findByCreatedBy(createdBy: number): Promise<CustomerNoteEntity[]>;
  findPublic(): Promise<CustomerNoteEntity[]>;
  findPrivate(): Promise<CustomerNoteEntity[]>;
}
