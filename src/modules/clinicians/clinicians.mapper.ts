import { Clinician } from 'src/database/entities';

export type ClinicianResponse = {
  clinicianId: string;
  userId: string;
  professionalLicense: string;
  profession: string;
  specialty: string;
  residence: string;
  institution: string;
};

export const toClinicianResponse = (
  clinician: Clinician,
): ClinicianResponse => ({
  clinicianId: clinician.clinicianId,
  userId: clinician.userId,
  professionalLicense: clinician.professionalLicense,
  profession: clinician.profession,
  specialty: clinician.specialty,
  residence: clinician.residence,
  institution: clinician.institution,
});
