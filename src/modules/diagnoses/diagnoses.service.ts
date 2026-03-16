import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnthropometricData, Consultation, Diagnosis } from 'src/database/entities';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { calculatePediatricAnthropometricResult } from 'src/common/utils/anthropometric.utils';

@Injectable()
export class DiagnosesService {
  constructor(
    @InjectRepository(Diagnosis)
    private readonly diagnosesRepository: Repository<Diagnosis>,
    @InjectRepository(AnthropometricData)
    private readonly anthropometricRepository: Repository<AnthropometricData>,
    @InjectRepository(Consultation)
    private readonly consultationsRepository: Repository<Consultation>,
  ) {}

  async create(dto: CreateDiagnosisDto): Promise<Diagnosis> {
    let bmi = dto.bmi ?? null;
    let zScorePercentile = dto.zScorePercentile ?? null;

    if (bmi === null || zScorePercentile === null) {
      const anthropometric = await this.anthropometricRepository.findOne({
        where: { consultationId: dto.consultationId },
        relations: { consultation: { patient: true } },
      });

      if (anthropometric) {
        if (bmi === null && anthropometric.bmi !== null) {
          bmi = Number(anthropometric.bmi);
        }

        if (zScorePercentile === null && anthropometric.zScore !== null) {
          zScorePercentile = Number(anthropometric.zScore);
        }

        const weightKg = Number(anthropometric.weightKg);
        const heightM = Number(anthropometric.heightM);
        const hasVitals = Number.isFinite(weightKg) && Number.isFinite(heightM);

        if ((bmi === null || zScorePercentile === null) && hasVitals) {
          const consultation = anthropometric.consultation ??
            (await this.consultationsRepository.findOne({
              where: { consultationId: dto.consultationId },
              relations: { patient: true },
            }));

          if (consultation) {
            const calculated = calculatePediatricAnthropometricResult({
              weightKg,
              heightM,
              birthDate: consultation.patient.birthDate,
              gender: consultation.patient.gender,
              measuredAt: consultation.consultationDate,
            });

            if (bmi === null) bmi = calculated.bmi;
            if (zScorePercentile === null) zScorePercentile = calculated.zScore;
          }
        }
      }
    }

    if (bmi === null || zScorePercentile === null) {
      throw new BadRequestException(
        'No se pudo calcular IMC o puntaje Z para el diagnostico.',
      );
    }

    const diagnosis = this.diagnosesRepository.create({
      ...dto,
      bmi: bmi.toString(),
      zScorePercentile: zScorePercentile.toString(),
    });
    return this.diagnosesRepository.save(diagnosis);
  }

  async findAll(): Promise<Diagnosis[]> {
    return this.diagnosesRepository.find({
      relations: { consultation: true, medicalHistory: true },
    });
  }
}
