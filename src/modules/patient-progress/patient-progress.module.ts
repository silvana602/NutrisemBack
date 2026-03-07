import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientProgress } from 'src/database/entities';
import { PatientProgressController } from './patient-progress.controller';
import { PatientProgressService } from './patient-progress.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientProgress])],
  controllers: [PatientProgressController],
  providers: [PatientProgressService],
  exports: [PatientProgressService],
})
export class PatientProgressModule {}
