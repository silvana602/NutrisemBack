import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DB_LENGTH } from '../constants/lengths.constants';
import { ReportFormat } from '../enums/report-format.enum';
import { AuditableEntity } from './base/auditable.entity';
import { User } from './user.entity';

@Entity('reports')
@Index('ix_reports_user_id_generation_date', ['userId', 'generationDate'])
export class Report extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'report_id' })
  reportId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({
    name: 'report_type',
    type: 'varchar',
    length: DB_LENGTH.REPORT_TYPE,
  })
  reportType!: string;

  @Column({
    type: 'enum',
    enum: ReportFormat,
    enumName: 'report_format',
  })
  format!: ReportFormat;

  @Column({
    name: 'analysis_period',
    type: 'varchar',
    length: DB_LENGTH.PERIOD,
  })
  analysisPeriod!: string;

  @Column({ name: 'generation_date', type: 'timestamptz' })
  generationDate!: Date;

  @ManyToOne(() => User, (user) => user.reports, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user!: User;
}
