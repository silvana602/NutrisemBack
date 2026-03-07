import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditableEntity } from './base/auditable.entity';
import { Clinician } from './clinician.entity';
import { Consultation } from './consultation.entity';
import { Diagnosis } from './diagnosis.entity';
import { Patient } from './patient.entity';

@Entity('histories')
@Index('ix_histories_patient_id', ['patientId'])
@Index('ix_histories_consultation_id', ['consultationId'])
@Index('ix_histories_clinician_id', ['clinicianId'])
export class History extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'history_id' })
  historyId!: string;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId!: string;

  @Column({ name: 'creation_date', type: 'timestamptz' })
  creationDate!: Date;

  @Column({ name: 'consultation_id', type: 'uuid', nullable: true })
  consultationId!: string | null;

  @Column({ name: 'clinician_id', type: 'uuid', nullable: true })
  clinicianId!: string | null;

  @Column({ type: 'text', nullable: true })
  summary!: string | null;

  @ManyToOne(() => Patient, (patient) => patient.histories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id', referencedColumnName: 'patientId' })
  patient!: Patient;

  @ManyToOne(() => Consultation, { onDelete: 'SET NULL' })
  @JoinColumn({
    name: 'consultation_id',
    referencedColumnName: 'consultationId',
  })
  consultation?: Consultation | null;

  @ManyToOne(() => Clinician, (clinician) => clinician.histories, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'clinician_id', referencedColumnName: 'clinicianId' })
  clinician?: Clinician | null;

  @OneToMany(() => Diagnosis, (diagnosis) => diagnosis.medicalHistory)
  diagnoses?: Diagnosis[];
}
