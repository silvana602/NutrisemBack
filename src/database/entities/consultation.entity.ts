import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditableEntity } from './base/auditable.entity';
import { Antecedent } from './antecedent.entity';
import { AnthropometricData } from './anthropometric-data.entity';
import { ClinicalData } from './clinical-data.entity';
import { Clinician } from './clinician.entity';
import { Diagnosis } from './diagnosis.entity';
import { Patient } from './patient.entity';

@Entity('consultations')
@Index('ix_consultations_patient_id', ['patientId'])
@Index('ix_consultations_clinician_id', ['clinicianId'])
@Index(
  'uq_consultations_patient_clinician_date_time',
  ['patientId', 'clinicianId', 'consultationDate', 'consultationTime'],
  {
    unique: true,
  },
)
export class Consultation extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'consultation_id' })
  consultationId!: string;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId!: string;

  @Column({ name: 'clinician_id', type: 'uuid' })
  clinicianId!: string;

  @Column({ name: 'consultation_date', type: 'date' })
  consultationDate!: string;

  @Column({ name: 'consultation_time', type: 'time without time zone' })
  consultationTime!: string;

  @ManyToOne(() => Patient, (patient) => patient.consultations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id', referencedColumnName: 'patientId' })
  patient!: Patient;

  @ManyToOne(() => Clinician, (clinician) => clinician.consultations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'clinician_id', referencedColumnName: 'clinicianId' })
  clinician!: Clinician;

  @OneToOne(
    () => AnthropometricData,
    (anthropometricData) => anthropometricData.consultation,
  )
  anthropometricData?: AnthropometricData;

  @OneToOne(() => ClinicalData, (clinicalData) => clinicalData.consultation)
  clinicalData?: ClinicalData;

  @OneToOne(() => Antecedent, (antecedent) => antecedent.consultation)
  antecedent?: Antecedent;

  @OneToOne(() => Diagnosis, (diagnosis) => diagnosis.consultation)
  diagnosis?: Diagnosis;
}
