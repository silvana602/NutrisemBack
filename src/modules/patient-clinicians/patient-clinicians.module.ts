import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientClinician } from 'src/database/entities';
import { PatientCliniciansController } from './patient-clinicians.controller';
import { PatientCliniciansService } from './patient-clinicians.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientClinician])],
  controllers: [PatientCliniciansController],
  providers: [PatientCliniciansService],
  exports: [PatientCliniciansService],
})
export class PatientCliniciansModule {}
