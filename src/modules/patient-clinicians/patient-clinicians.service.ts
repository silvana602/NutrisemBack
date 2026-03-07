import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientClinician } from 'src/database/entities';
import { CreatePatientClinicianDto } from './dto/create-patient-clinician.dto';

@Injectable()
export class PatientCliniciansService {
  constructor(
    @InjectRepository(PatientClinician)
    private readonly patientCliniciansRepository: Repository<PatientClinician>,
  ) {}

  async create(dto: CreatePatientClinicianDto): Promise<PatientClinician> {
    const patientClinician = this.patientCliniciansRepository.create(dto);
    return this.patientCliniciansRepository.save(patientClinician);
  }

  async findAll(): Promise<PatientClinician[]> {
    return this.patientCliniciansRepository.find({
      relations: { patient: true, clinician: true },
    });
  }
}
