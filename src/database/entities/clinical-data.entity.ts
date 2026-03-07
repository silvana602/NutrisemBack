import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericColumn } from '../utils/column-options.utils';
import { AuditableEntity } from './base/auditable.entity';
import { Consultation } from './consultation.entity';

@Entity('clinical_data')
@Index('uq_clinical_data_consultation_id', ['consultationId'], { unique: true })
@Check(
  'ck_clinical_data_temperature_non_negative',
  '"temperature_celsius" IS NULL OR "temperature_celsius" >= 0',
)
@Check(
  'ck_clinical_data_heart_rate_non_negative',
  '"heart_rate" IS NULL OR "heart_rate" >= 0',
)
@Check(
  'ck_clinical_data_respiratory_rate_non_negative',
  '"respiratory_rate" IS NULL OR "respiratory_rate" >= 0',
)
@Check(
  'ck_clinical_data_blood_pressure_values',
  '("blood_pressure_systolic" IS NULL OR "blood_pressure_systolic" >= 0) AND ("blood_pressure_diastolic" IS NULL OR "blood_pressure_diastolic" >= 0)',
)
export class ClinicalData extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'clinical_data_id' })
  clinicalDataId!: string;

  @Column({ name: 'consultation_id', type: 'uuid' })
  consultationId!: string;

  @Column({ name: 'main_consultation_reason', type: 'text', nullable: true })
  mainConsultationReason!: string | null;

  @Column({
    name: 'informant_type',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  informantType!: string | null;

  @Column({
    name: 'informant_name',
    type: 'varchar',
    length: 160,
    nullable: true,
  })
  informantName!: string | null;

  @Column({
    name: 'informant_relationship',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  informantRelationship!: string | null;

  @Column({ name: 'alarm_signs', type: 'jsonb', nullable: true })
  alarmSigns!: Record<string, unknown> | null;

  @Column({ name: 'birth_weight_kg', ...numericColumn(4, 2, true) })
  birthWeightKg!: string | null;

  @Column({ name: 'gestational_age_weeks', type: 'integer', nullable: true })
  gestationalAgeWeeks!: number | null;

  @Column({ name: 'prematurity', type: 'varchar', length: 80, nullable: true })
  prematurity!: string | null;

  @Column({ name: 'activity_level', type: 'jsonb', nullable: true })
  activityLevel!: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  apathy!: Record<string, unknown> | null;

  @Column({ name: 'general_observations', type: 'text', nullable: true })
  generalObservations!: string | null;

  @Column({ name: 'hair_condition', type: 'jsonb', nullable: true })
  hairCondition!: Record<string, unknown> | null;

  @Column({ name: 'skin_condition', type: 'jsonb', nullable: true })
  skinCondition!: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  edema!: Record<string, unknown> | null;

  @Column({
    name: 'bilateral_edema_grade',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  bilateralEdemaGrade!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  dentition!: Record<string, unknown> | null;

  @Column({ name: 'physical_observations', type: 'text', nullable: true })
  physicalObservations!: string | null;

  @Column({ type: 'text', nullable: true })
  diarrhea!: string | null;

  @Column({ type: 'text', nullable: true })
  vomiting!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  dehydration!: Record<string, unknown> | null;

  @Column({ name: 'digestive_observations', type: 'text', nullable: true })
  digestiveObservations!: string | null;

  @Column({ name: 'temperature_celsius', ...numericColumn(4, 1, true) })
  temperatureCelsius!: string | null;

  @Column({ name: 'temperature_observation', type: 'text', nullable: true })
  temperatureObservation!: string | null;

  @Column({ name: 'heart_rate', type: 'integer', nullable: true })
  heartRate!: number | null;

  @Column({ name: 'heart_rate_observation', type: 'text', nullable: true })
  heartRateObservation!: string | null;

  @Column({ name: 'respiratory_rate', type: 'integer', nullable: true })
  respiratoryRate!: number | null;

  @Column({
    name: 'respiratory_rate_observation',
    type: 'text',
    nullable: true,
  })
  respiratoryRateObservation!: string | null;

  @Column({ name: 'blood_pressure_systolic', type: 'integer', nullable: true })
  bloodPressureSystolic!: number | null;

  @Column({ name: 'blood_pressure_diastolic', type: 'integer', nullable: true })
  bloodPressureDiastolic!: number | null;

  @Column({
    name: 'blood_pressure',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  bloodPressure!: string | null;

  @Column({ name: 'blood_pressure_observation', type: 'text', nullable: true })
  bloodPressureObservation!: string | null;

  @Column({ type: 'text', nullable: true })
  observations!: string | null;

  @OneToOne(() => Consultation, (consultation) => consultation.clinicalData, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'consultation_id',
    referencedColumnName: 'consultationId',
  })
  consultation!: Consultation;
}
