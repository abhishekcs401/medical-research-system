import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Participant } from './Participant';

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ type: 'date' })
  startDate!: string;

  @Column({ type: 'date' })
  endDate!: string;

  @Column('float')
  budget!: number;

  @Column({ nullable: true })
  attachment!: string;

  @OneToMany(() => Participant, participant => participant.program, {
    cascade: true,
  })
  participants!: Participant[];

  // Creator metadata

  @Column()
  createdByEmail!: string;

  @Column()
  createdByRole!: string;

  // Creator Date metadata
  @CreateDateColumn()
  createdAt!: Date;

  // Updated Date metadata
  @UpdateDateColumn()
  updatedAt!: Date;
}
