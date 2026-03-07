import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicalData } from 'src/database/entities';
import { CreateClinicalDataDto } from './dto/create-clinical-data.dto';

@Injectable()
export class ClinicalDataService {
  constructor(
    @InjectRepository(ClinicalData)
    private readonly clinicalDataRepository: Repository<ClinicalData>,
  ) {}

  async create(dto: CreateClinicalDataDto): Promise<ClinicalData> {
    const clinicalData = this.clinicalDataRepository.create({
      ...dto,
      mainConsultationReason: dto.mainConsultationReason ?? null,
      informantType: dto.informantType ?? null,
      informantName: dto.informantName ?? null,
      informantRelationship: dto.informantRelationship ?? null,
      alarmSigns: dto.alarmSigns ?? null,
      activityLevel: dto.activityLevel ?? null,
      apathy: dto.apathy ?? null,
      generalObservations: dto.generalObservations ?? null,
      observations: dto.observations ?? null,
    });
    return this.clinicalDataRepository.save(clinicalData);
  }

  async findAll(): Promise<ClinicalData[]> {
    return this.clinicalDataRepository.find({
      relations: { consultation: true },
    });
  }
}
