import { Module } from '@nestjs/common';
import { PublicTrendsController } from './public-trends.controller';

@Module({
  controllers: [PublicTrendsController],
})
export class PublicModule {}
