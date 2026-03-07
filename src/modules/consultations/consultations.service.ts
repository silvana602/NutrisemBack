import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation } from 'src/database/entities';
import { CreateConsultationDto } from './dto/create-consultation.dto';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationsRepository: Repository<Consultation>,
  ) {}

  async create(dto: CreateConsultationDto): Promise<Consultation> {
    const consultation = this.consultationsRepository.create(dto);
    return this.consultationsRepository.save(consultation);
  }

  async findAll(): Promise<Consultation[]> {
    return this.consultationsRepository.find({
      relations: { patient: true, clinician: true },
    });
  }
}
