import {
  Check,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DB_LENGTH } from '../constants/lengths.constants';
import { numericColumn } from '../utils/column-options.utils';
import { nonNegativeCheck } from '../utils/check.utils';
import { AuditableEntity } from './base/auditable.entity';
import { RecommendationFood } from './recommendation-food.entity';

@Entity('foods')
@Index('uq_foods_food_name_category', ['foodName', 'category'], {
  unique: true,
})
@Check('ck_foods_energy_kcal_non_negative', nonNegativeCheck('energy_kcal'))
@Check('ck_foods_protein_g_non_negative', nonNegativeCheck('protein_g'))
@Check('ck_foods_fat_g_non_negative', nonNegativeCheck('fat_g'))
@Check(
  'ck_foods_carbohydrates_g_non_negative',
  nonNegativeCheck('carbohydrates_g'),
)
@Check('ck_foods_fiber_g_non_negative', nonNegativeCheck('fiber_g'))
export class Food extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'food_id' })
  foodId!: string;

  @Column({ name: 'food_name', type: 'varchar', length: DB_LENGTH.NAME })
  foodName!: string;

  @Column({ type: 'varchar', length: DB_LENGTH.CATEGORY })
  category!: string;

  @Column({ name: 'energy_kcal', ...numericColumn(8, 2) })
  energyKcal!: string;

  @Column({ name: 'protein_g', ...numericColumn(8, 2) })
  proteinG!: string;

  @Column({ name: 'fat_g', ...numericColumn(8, 2) })
  fatG!: string;

  @Column({ name: 'carbohydrates_g', ...numericColumn(8, 2) })
  carbohydratesG!: string;

  @Column({ name: 'fiber_g', ...numericColumn(8, 2) })
  fiberG!: string;

  @Column({ type: 'text' })
  vitamins!: string;

  @Column({ type: 'text' })
  minerals!: string;

  @Column({
    name: 'serving_size',
    type: 'varchar',
    length: DB_LENGTH.MEDIUM_LABEL,
    nullable: true,
  })
  servingSize!: string | null;

  @Column({ type: 'text', nullable: true })
  allergens!: string | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @OneToMany(
    () => RecommendationFood,
    (recommendationFood) => recommendationFood.food,
  )
  recommendationFoods?: RecommendationFood[];
}
