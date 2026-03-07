import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DB_LENGTH } from '../constants/lengths.constants';
import { AuditableEntity } from './base/auditable.entity';
import { Consultation } from './consultation.entity';
import { History } from './history.entity';
import { PatientClinician } from './patient-clinician.entity';
import { User } from './user.entity';

@Entity('clinicians')
@Index('uq_clinicians_user_id', ['userId'], { unique: true })
@Index('uq_clinicians_professional_license', ['professionalLicense'], {
  unique: true,
})
export class Clinician extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'clinician_id' })
  clinicianId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({
    name: 'professional_license',
    type: 'varchar',
    length: DB_LENGTH.LICENSE,
  })
  professionalLicense!: string;

  @Column({ type: 'varchar', length: DB_LENGTH.PROFESSION })
  profession!: string;

  @Column({ type: 'varchar', length: DB_LENGTH.SPECIALTY })
  specialty!: string;

  @Column({ type: 'varchar', length: DB_LENGTH.RESIDENCE })
  residence!: string;

  @Column({ type: 'varchar', length: DB_LENGTH.INSTITUTION })
  institution!: string;

  @OneToOne(() => User, (user) => user.clinician, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user!: User;

  @OneToMany(() => Consultation, (consultation) => consultation.clinician)
  consultations?: Consultation[];

  @OneToMany(
    () => PatientClinician,
    (patientClinician) => patientClinician.clinician,
  )
  patientClinicians?: PatientClinician[];

  @OneToMany(() => History, (history) => history.clinician)
  histories?: History[];
}
