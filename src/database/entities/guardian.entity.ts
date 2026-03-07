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
import { Patient } from './patient.entity';

@Entity('guardians')
@Index('ix_guardians_patient_id', ['patientId'])
@Index(
  'uq_guardians_patient_identity_number',
  ['patientId', 'identityNumber'],
  { unique: true },
)
export class Guardian extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'guardian_id' })
  guardianId!: string;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId!: string;

  @Column({ name: 'first_name', type: 'varchar', length: DB_LENGTH.NAME })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', length: DB_LENGTH.NAME })
  lastName!: string;

  @Column({
    name: 'identity_number',
    type: 'varchar',
    length: DB_LENGTH.IDENTITY,
  })
  identityNumber!: string;

  @Column({ type: 'varchar', length: DB_LENGTH.ADDRESS })
  address!: string;

  @Column({ type: 'varchar', length: DB_LENGTH.PHONE })
  phone!: string;

  @Column({ type: 'varchar', length: DB_LENGTH.RELATIONSHIP })
  relationship!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: DB_LENGTH.EMAIL })
  passwordHash!: string;

  @ManyToOne(() => Patient, (patient) => patient.guardians, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id', referencedColumnName: 'patientId' })
  patient!: Patient;
}
