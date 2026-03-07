import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { AuditableEntity } from './base/auditable.entity';
import { Clinician } from './clinician.entity';
import { Patient } from './patient.entity';

@Entity('patient_clinicians')
@Index(
  'uq_patient_clinicians_patient_id_clinician_id',
  ['patientId', 'clinicianId'],
  { unique: true },
)
export class PatientClinician extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'patient_clinician_id' })
  patientClinicianId!: string;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId!: string;

  @Column({ name: 'clinician_id', type: 'uuid' })
  clinicianId!: string;

  @ManyToOne(() => Patient, (patient) => patient.patientClinicians, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id', referencedColumnName: 'patientId' })
  patient!: Patient;

  @ManyToOne(() => Clinician, (clinician) => clinician.patientClinicians, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clinician_id', referencedColumnName: 'clinicianId' })
  clinician!: Clinician;
}
