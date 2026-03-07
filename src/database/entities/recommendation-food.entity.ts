import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DB_LENGTH } from '../constants/lengths.constants';
import { AuditableEntity } from './base/auditable.entity';
import { Food } from './food.entity';
import { Recommendation } from './recommendation.entity';

@Entity('recommendation_foods')
@Index(
  'uq_recommendation_foods_recommendation_id_food_id',
  ['recommendationId', 'foodId'],
  { unique: true },
)
export class RecommendationFood extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'recommendation_food_id' })
  recommendationFoodId!: string;

  @Column({ name: 'recommendation_id', type: 'uuid' })
  recommendationId!: string;

  @Column({ name: 'food_id', type: 'uuid' })
  foodId!: string;

  @Column({
    name: 'daily_amount',
    type: 'varchar',
    length: DB_LENGTH.MEDIUM_LABEL,
  })
  dailyAmount!: string;

  @Column({
    name: 'reference_age',
    type: 'varchar',
    length: DB_LENGTH.MEDIUM_LABEL,
  })
  referenceAge!: string;

  @ManyToOne(
    () => Recommendation,
    (recommendation) => recommendation.recommendationFoods,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'recommendation_id',
    referencedColumnName: 'recommendationId',
  })
  recommendation!: Recommendation;

  @ManyToOne(() => Food, (food) => food.recommendationFoods, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'food_id', referencedColumnName: 'foodId' })
  food!: Food;
}
