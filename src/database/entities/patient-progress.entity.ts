import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericColumn } from '../utils/column-options.utils';
import { positiveCheck } from '../utils/check.utils';
import { AuditableEntity } from './base/auditable.entity';
import { Patient } from './patient.entity';

@Entity('patient_progress')
@Index(
  'uq_patient_progress_patient_id_progress_date',
  ['patientId', 'progressDate'],
  { unique: true },
)
@Check('ck_patient_progress_weight_kg_positive', positiveCheck('weight_kg'))
@Check('ck_patient_progress_height_cm_positive', positiveCheck('height_cm'))
@Check('ck_patient_progress_bmi_positive', positiveCheck('bmi'))
export class PatientProgress extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'progress_id' })
  progressId!: string;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId!: string;

  @Column({ name: 'progress_date', type: 'date' })
  progressDate!: string;

  @Column({ name: 'weight_kg', ...numericColumn(5, 2) })
  weightKg!: string;

  @Column({ name: 'height_cm', ...numericColumn(5, 2) })
  heightCm!: string;

  @Column({ name: 'bmi', ...numericColumn(5, 2) })
  bmi!: string;

  @ManyToOne(() => Patient, (patient) => patient.progress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id', referencedColumnName: 'patientId' })
  patient!: Patient;
}
