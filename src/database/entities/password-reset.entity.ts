import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DB_LENGTH } from '../constants/lengths.constants';
import { AuditableEntity } from './base/auditable.entity';
import { User } from './user.entity';

export type PasswordResetChannel = 'sms' | 'whatsapp';

@Entity('password_resets')
@Index('ix_password_resets_user_id', ['userId'])
@Index('ix_password_resets_user_active', ['userId', 'usedAt', 'expiresAt'])
export class PasswordReset extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'password_reset_id' })
  passwordResetId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'code_hash', type: 'varchar', length: DB_LENGTH.EMAIL })
  codeHash!: string;

  @Column({
    name: 'delivery_channel',
    type: 'varchar',
    length: DB_LENGTH.SMALL_LABEL,
  })
  deliveryChannel!: PasswordResetChannel;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ name: 'used_at', type: 'timestamptz', nullable: true })
  usedAt!: Date | null;

  @Column({ name: 'attempts', type: 'int', default: 0 })
  attempts!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user?: User;
}
