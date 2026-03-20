import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import {
  Antecedent,
  AnthropometricData,
  ClinicalData,
  Clinician,
  Consultation,
  Diagnosis,
  Food,
  Guardian,
  History,
  Patient,
  PatientClinician,
  PatientProgress,
    PasswordReset,
  Recommendation,
  RecommendationFood,
  Report,
  User,
} from './entities';

const parsePort = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const baseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? process.env.DATABASE_HOST ?? 'localhost',
  port: parsePort(process.env.DB_PORT ?? process.env.DATABASE_PORT, 5432),
  username: process.env.DB_USER ?? process.env.DATABASE_USER ?? 'postgres',
  password:
    process.env.DB_PASSWORD ?? process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? process.env.DATABASE_NAME ?? 'nutrisem',
  entities: [
    User,
    Clinician,
    Patient,
    Guardian,
    PatientClinician,
    Consultation,
    History,
    PatientProgress,
    PasswordReset,
    AnthropometricData,
    ClinicalData,
    Antecedent,
    Diagnosis,
    Recommendation,
    Food,
    RecommendationFood,
    Report,
  ],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
  logging: false,
  ssl:
    (process.env.DB_SSL ?? process.env.DATABASE_SSL) === 'true'
      ? { rejectUnauthorized: false }
      : false,
};

export const typeOrmConfig: TypeOrmModuleOptions = baseConfig;

export default new DataSource(baseConfig);
