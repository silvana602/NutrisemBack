import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinician } from 'src/database/entities';
import { CreateClinicianDto } from './dto/create-clinician.dto';

@Injectable()
export class CliniciansService {
  constructor(
    @InjectRepository(Clinician)
    private readonly cliniciansRepository: Repository<Clinician>,
  ) {}

  async create(dto: CreateClinicianDto): Promise<Clinician> {
    const clinician = this.cliniciansRepository.create(dto);
    return this.cliniciansRepository.save(clinician);
  }

  async findAll(): Promise<Clinician[]> {
    return this.cliniciansRepository.find({ relations: { user: true } });
  }

  async findByUserId(userId: string): Promise<Clinician | null> {
    return this.cliniciansRepository.findOne({ where: { userId } });
  }
}
