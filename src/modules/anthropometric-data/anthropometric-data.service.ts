import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnthropometricData, Consultation } from 'src/database/entities';
import { CreateAnthropometricDataDto } from './dto/create-anthropometric-data.dto';
import { calculatePediatricAnthropometricResult } from 'src/common/utils/anthropometric.utils';

@Injectable()
export class AnthropometricDataService {
  constructor(
    @InjectRepository(AnthropometricData)
    private readonly anthropometricDataRepository: Repository<AnthropometricData>,
    @InjectRepository(Consultation)
    private readonly consultationsRepository: Repository<Consultation>,
  ) {}

  async create(dto: CreateAnthropometricDataDto): Promise<AnthropometricData> {
    const consultation = await this.consultationsRepository.findOne({
      where: { consultationId: dto.consultationId },
      relations: { patient: true },
    });

    if (!consultation) {
      throw new NotFoundException('Consulta no encontrada.');
    }

    const calculated = calculatePediatricAnthropometricResult({
      weightKg: dto.weightKg,
      heightM: dto.heightM,
      birthDate: consultation.patient.birthDate,
      gender: consultation.patient.gender,
      measuredAt: consultation.consultationDate,
    });

    const anthropometricData = this.anthropometricDataRepository.create({
      consultationId: dto.consultationId,
      weightKg: dto.weightKg.toString(),
      heightM: dto.heightM.toString(),
      muacCm: dto.muacCm.toString(),
      headCircumferenceCm: dto.headCircumferenceCm.toString(),
      bmi: calculated.bmi !== null ? calculated.bmi.toString() : null,
      zScore: calculated.zScore !== null ? calculated.zScore.toString() : null,
      percentile:
        calculated.percentile !== null ? calculated.percentile.toString() : null,
    });
    return this.anthropometricDataRepository.save(anthropometricData);
  }

  async findAll(): Promise<AnthropometricData[]> {
    return this.anthropometricDataRepository.find({
      relations: { consultation: true },
    });
  }
}
