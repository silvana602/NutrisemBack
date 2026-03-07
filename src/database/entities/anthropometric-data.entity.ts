import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { positiveCheck } from '../utils/check.utils';
import { numericColumn } from '../utils/column-options.utils';
import { AuditableEntity } from './base/auditable.entity';
import { Consultation } from './consultation.entity';

@Entity('anthropometric_data')
@Index('uq_anthropometric_data_consultation_id', ['consultationId'], {
  unique: true,
})
@Check('ck_anthropometric_data_weight_kg_positive', positiveCheck('weight_kg'))
@Check('ck_anthropometric_data_height_m_positive', positiveCheck('height_m'))
@Check('ck_anthropometric_data_muac_cm_positive', positiveCheck('muac_cm'))
@Check(
  'ck_anthropometric_data_head_circumference_cm_positive',
  positiveCheck('head_circumference_cm'),
)
@Check('ck_anthropometric_data_bmi_non_negative', '"bmi" IS NULL OR "bmi" >= 0')
@Check(
  'ck_anthropometric_data_percentile_range',
  '"percentile" IS NULL OR "percentile" BETWEEN 0 AND 100',
)
export class AnthropometricData extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'anthropometric_data_id' })
  anthropometricDataId!: string;

  @Column({ name: 'consultation_id', type: 'uuid' })
  consultationId!: string;

  @Column({ name: 'weight_kg', ...numericColumn(5, 2) })
  weightKg!: string;

  @Column({ name: 'height_m', ...numericColumn(4, 2) })
  heightM!: string;

  @Column({ name: 'muac_cm', ...numericColumn(5, 2) })
  muacCm!: string;

  @Column({ name: 'head_circumference_cm', ...numericColumn(5, 2) })
  headCircumferenceCm!: string;

  @Column({ name: 'bmi', ...numericColumn(5, 2, true) })
  bmi!: string | null;

  @Column({ name: 'z_score', ...numericColumn(5, 2, true) })
  zScore!: string | null;

  @Column({ name: 'percentile', ...numericColumn(5, 2, true) })
  percentile!: string | null;

  @OneToOne(
    () => Consultation,
    (consultation) => consultation.anthropometricData,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'consultation_id',
    referencedColumnName: 'consultationId',
  })
  consultation!: Consultation;
}
