import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Antecedent } from 'src/database/entities';
import { AntecedentsController } from './antecedents.controller';
import { AntecedentsService } from './antecedents.service';

@Module({
  imports: [TypeOrmModule.forFeature([Antecedent])],
  controllers: [AntecedentsController],
  providers: [AntecedentsService],
  exports: [AntecedentsService],
})
export class AntecedentsModule {}
