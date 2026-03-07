import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalData } from 'src/database/entities';
import { ClinicalDataController } from './clinical-data.controller';
import { ClinicalDataService } from './clinical-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicalData])],
  controllers: [ClinicalDataController],
  providers: [ClinicalDataService],
  exports: [ClinicalDataService],
})
export class ClinicalDataModule {}
