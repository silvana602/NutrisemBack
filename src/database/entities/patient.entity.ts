import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gender } from '../enums/gender.enum';
import { DB_LENGTH } from '../constants/lengths.constants';
import { AuditableEntity } from './base/auditable.entity';
import { Consultation } from './consultation.entity';
import { Guardian } from './guardian.entity';
import { History } from './history.entity';
import { PatientClinician } from './patient-clinician.entity';
import { PatientProgress } from './patient-progress.entity';
import { User } from './user.entity';

@Entity('patients')
@Index('uq_patients_user_id', ['userId'], { unique: true })
@Index('uq_patients_identity_number', ['identityNumber'], { unique: true })
export class Patient extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'patient_id' })
  patientId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

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

  @Column({ name: 'birth_date', type: 'date' })
  birthDate!: string;

  @Column({
    type: 'enum',
    enum: Gender,
    enumName: 'gender',
  })
  gender!: Gender;

  @Column({ type: 'varchar', length: DB_LENGTH.ADDRESS })
  address!: string;

  @OneToOne(() => User, (user) => user.patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user!: User;

  @OneToMany(() => Guardian, (guardian) => guardian.patient)
  guardians?: Guardian[];

  @OneToMany(
    () => PatientClinician,
    (patientClinician) => patientClinician.patient,
  )
  patientClinicians?: PatientClinician[];

  @OneToMany(() => Consultation, (consultation) => consultation.patient)
  consultations?: Consultation[];

  @OneToMany(() => History, (history) => history.patient)
  histories?: History[];

  @OneToMany(
    () => PatientProgress,
    (patientProgress) => patientProgress.patient,
  )
  progress?: PatientProgress[];
}
