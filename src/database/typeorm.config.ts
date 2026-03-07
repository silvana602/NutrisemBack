import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { UserSetting } from 'src/modules/settings/entities/user-setting.entity';
import { Patient } from 'src/modules/patients/entities/patient.entity';
import { Clinician } from 'src/modules/clinicians/entities/clinician.entity';
import { Diagnosis } from 'src/modules/diagnosis/entities/diagnosis.entity';
import { Recommendation } from 'src/modules/recommendations/entities/recommendation.entity';
import { Consultation } from 'src/modules/consultations/entities/consultation.entity';

const baseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'nutrisem',
  entities: [User, UserSetting, Patient, Clinician, Diagnosis, Recommendation, Consultation],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
  logging: false,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
};

export const typeOrmConfig: TypeOrmModuleOptions = baseConfig;

export default new DataSource(baseConfig);
