import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnthropometricData, Consultation } from 'src/database/entities';
import { AnthropometricDataController } from './anthropometric-data.controller';
import { AnthropometricDataService } from './anthropometric-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnthropometricData, Consultation])],
  controllers: [AnthropometricDataController],
  providers: [AnthropometricDataService],
  exports: [AnthropometricDataService],
})
export class AnthropometricDataModule {}
