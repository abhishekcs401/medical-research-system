import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DeleteAudit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  entity!: string;

  @Column()
  entityId!: number;

  @Column({ type: 'jsonb', nullable: true })
  payload!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
