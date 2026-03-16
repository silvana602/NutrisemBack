import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientProgress } from 'src/database/entities';
import { CreatePatientProgressDto } from './dto/create-patient-progress.dto';
import { calculateBmi } from 'src/common/utils/anthropometric.utils';

@Injectable()
export class PatientProgressService {
  constructor(
    @InjectRepository(PatientProgress)
    private readonly patientProgressRepository: Repository<PatientProgress>,
  ) {}

  async create(dto: CreatePatientProgressDto): Promise<PatientProgress> {
    const heightM = dto.heightCm / 100;
    const calculatedBmi = dto.bmi ?? calculateBmi(dto.weightKg, heightM);

    if (calculatedBmi === null) {
      throw new BadRequestException('No se pudo calcular el IMC del progreso.');
    }

    const patientProgress = this.patientProgressRepository.create({
      patientId: dto.patientId,
      progressDate: dto.progressDate,
      weightKg: dto.weightKg.toString(),
      heightCm: dto.heightCm.toString(),
      bmi: calculatedBmi.toString(),
    });
    return this.patientProgressRepository.save(patientProgress);
  }

  async findAll(): Promise<PatientProgress[]> {
    return this.patientProgressRepository.find({
      relations: { patient: true },
    });
  }
}
