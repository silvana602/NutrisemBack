import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../../common/enums/role.enum';
import { DB_LENGTH } from '../constants/lengths.constants';
import { AuditableEntity } from './base/auditable.entity';
import { Clinician } from './clinician.entity';
import { Patient } from './patient.entity';
import { Report } from './report.entity';

@Entity('users')
@Index('uq_users_identity_number', ['identityNumber'], { unique: true })
@Index('uq_users_email', ['email'], {
  unique: true,
  where: '"email" IS NOT NULL',
})
export class User extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
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

  @Column({ type: 'varchar', length: DB_LENGTH.EMAIL, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: DB_LENGTH.PHONE })
  phone!: string;

  @Column({ type: 'varchar', length: DB_LENGTH.ADDRESS })
  address!: string;

  @Column({
    name: 'profile_photo',
    type: 'varchar',
    length: DB_LENGTH.URL,
    nullable: true,
  })
  profilePhoto!: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role',
  })
  role!: UserRole;

  @Column({ name: 'password_hash', type: 'varchar', length: DB_LENGTH.EMAIL })
  passwordHash!: string;

  @OneToOne(() => Clinician, (clinician) => clinician.user)
  clinician?: Clinician;

  @OneToOne(() => Patient, (patient) => patient.user)
  patient?: Patient;

  @OneToMany(() => Report, (report) => report.user)
  reports?: Report[];
}
