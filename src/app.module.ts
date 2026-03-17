import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './common/config/database.config';
import { typeOrmConfig } from './database/typeorm.config';
import { AntecedentsModule } from './modules/antecedents/antecedents.module';
import { AnthropometricDataModule } from './modules/anthropometric-data/anthropometric-data.module';
import { AuthModule } from './modules/auth/auth.module';
import { CalculationsModule } from './modules/calculations/calculations.module';
import { CliniciansModule } from './modules/clinicians/clinicians.module';
import { ClinicalDataModule } from './modules/clinical-data/clinical-data.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { DiagnosesModule } from './modules/diagnoses/diagnoses.module';
import { FoodsModule } from './modules/foods/foods.module';
import { GuardiansModule } from './modules/guardians/guardians.module';
import { HistoriesModule } from './modules/histories/histories.module';
import { PatientCliniciansModule } from './modules/patient-clinicians/patient-clinicians.module';
import { PatientProgressModule } from './modules/patient-progress/patient-progress.module';
import { PatientsModule } from './modules/patients/patients.module';
import { PublicModule } from './modules/public/public.module';
import { RecommendationFoodsModule } from './modules/recommendation-foods/recommendation-foods.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UsersModule,
    CliniciansModule,
    PatientsModule,
    GuardiansModule,
    PatientCliniciansModule,
    ConsultationsModule,
    HistoriesModule,
    PatientProgressModule,
    PublicModule,
    AnthropometricDataModule,
    ClinicalDataModule,
    AntecedentsModule,
    DiagnosesModule,
    RecommendationsModule,
    FoodsModule,
    RecommendationFoodsModule,
    ReportsModule,
    CalculationsModule,
  ],
})
export class AppModule {}
