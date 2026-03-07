import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditableEntity } from './base/auditable.entity';
import { Diagnosis } from './diagnosis.entity';
import { RecommendationFood } from './recommendation-food.entity';

@Entity('recommendations')
@Index('ix_recommendations_diagnosis_id', ['diagnosisId'])
export class Recommendation extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'recommendation_id' })
  recommendationId!: string;

  @Column({ name: 'diagnosis_id', type: 'uuid' })
  diagnosisId!: string;

  @Column({ name: 'medical_recommendation', type: 'text' })
  medicalRecommendation!: string;

  @Column({ name: 'dietary_recommendation', type: 'text' })
  dietaryRecommendation!: string;

  @ManyToOne(() => Diagnosis, (diagnosis) => diagnosis.recommendations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'diagnosis_id', referencedColumnName: 'diagnosisId' })
  diagnosis!: Diagnosis;

  @OneToMany(
    () => RecommendationFood,
    (recommendationFood) => recommendationFood.recommendation,
  )
  recommendationFoods?: RecommendationFood[];
}
