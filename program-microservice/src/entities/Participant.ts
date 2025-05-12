import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Program } from './Program';

@Entity()
export class Participant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column('int')
  age!: number;

  @Column({ type: 'date' })
  joinedDate!: string;

  @ManyToOne(() => Program, program => program.participants, {
    onDelete: 'CASCADE',
  })
  program!: Program;

  //Creator metadata
  @Column()
  createdByEmail!: string;

  @Column()
  createdByRole!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
