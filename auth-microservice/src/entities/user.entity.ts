import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({ default: 'participant' })
  role!: 'admin' | 'participant';

  @Column({ type: 'text', nullable: true })
  profilePicture!: string | null;

  @Column({ type: 'text', nullable: true })
  refreshToken!: string | null;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ type: 'text', nullable: true })
  verificationToken!: string | null;

  @Column({ type: 'text', nullable: true })
  resetToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt!: Date | null;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: 0 })
  loginAttempts!: number;

  @Column({ type: 'timestamp', nullable: true })
  lockUntil!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
