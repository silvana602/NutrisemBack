import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinician } from 'src/database/entities';
import { CliniciansController } from './clinicians.controller';
import { CliniciansService } from './clinicians.service';

@Module({
  imports: [TypeOrmModule.forFeature([Clinician])],
  controllers: [CliniciansController],
  providers: [CliniciansService],
  exports: [CliniciansService],
})
export class CliniciansModule {}
