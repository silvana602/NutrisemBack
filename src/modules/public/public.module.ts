import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicTrendsController } from './public-trends.controller';
import { PublicPulseController } from './public-pulse.controller';
import { Consultation, Diagnosis } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Consultation, Diagnosis])],
  controllers: [PublicTrendsController, PublicPulseController],
})
export class PublicModule {}
