import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnthropometricData, Consultation, Diagnosis } from 'src/database/entities';
import { DiagnosesController } from './diagnoses.controller';
import { DiagnosesService } from './diagnoses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Diagnosis, AnthropometricData, Consultation])],
  controllers: [DiagnosesController],
  providers: [DiagnosesService],
  exports: [DiagnosesService],
})
export class DiagnosesModule {}
