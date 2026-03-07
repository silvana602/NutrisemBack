import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericColumn } from '../utils/column-options.utils';
import { positiveCheck } from '../utils/check.utils';
import { AuditableEntity } from './base/auditable.entity';
import { Consultation } from './consultation.entity';
import { History } from './history.entity';
import { Recommendation } from './recommendation.entity';

@Entity('diagnoses')
@Index('uq_diagnoses_consultation_id', ['consultationId'], { unique: true })
@Index('ix_diagnoses_medical_history_id', ['medicalHistoryId'])
@Check('ck_diagnoses_bmi_positive', positiveCheck('bmi'))
export class Diagnosis extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'diagnosis_id' })
  diagnosisId!: string;

  @Column({ name: 'consultation_id', type: 'uuid' })
  consultationId!: string;

  @Column({ name: 'medical_history_id', type: 'uuid' })
  medicalHistoryId!: string;

  @Column({ name: 'bmi', ...numericColumn(5, 2) })
  bmi!: string;

  @Column({ name: 'z_score_percentile', ...numericColumn(6, 2) })
  zScorePercentile!: string;

  @Column({ name: 'nutritional_diagnosis', type: 'text' })
  nutritionalDiagnosis!: string;

  @Column({ name: 'diagnosis_details', type: 'text' })
  diagnosisDetails!: string;

  @OneToOne(() => Consultation, (consultation) => consultation.diagnosis, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'consultation_id',
    referencedColumnName: 'consultationId',
  })
  consultation!: Consultation;

  @ManyToOne(() => History, (history) => history.diagnoses, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'medical_history_id', referencedColumnName: 'historyId' })
  medicalHistory!: History;

  @OneToMany(() => Recommendation, (recommendation) => recommendation.diagnosis)
  recommendations?: Recommendation[];
}
