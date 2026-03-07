import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnthropometricData } from 'src/database/entities';
import { AnthropometricDataController } from './anthropometric-data.controller';
import { AnthropometricDataService } from './anthropometric-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnthropometricData])],
  controllers: [AnthropometricDataController],
  providers: [AnthropometricDataService],
  exports: [AnthropometricDataService],
})
export class AnthropometricDataModule {}
