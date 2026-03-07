import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericColumn } from '../utils/column-options.utils';
import { AuditableEntity } from './base/auditable.entity';
import { Consultation } from './consultation.entity';

@Entity('antecedents')
@Index('uq_antecedents_consultation_id', ['consultationId'], { unique: true })
@Check(
  'ck_antecedents_water_glasses_per_day_non_negative',
  '"water_glasses_per_day" IS NULL OR "water_glasses_per_day" >= 0',
)
@Check(
  'ck_antecedents_sleep_average_hours_range',
  '"sleep_average_hours" IS NULL OR "sleep_average_hours" BETWEEN 0 AND 24',
)
@Check(
  'ck_antecedents_average_sleep_hours_range',
  '"average_sleep_hours" IS NULL OR "average_sleep_hours" BETWEEN 0 AND 24',
)
export class Antecedent extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'antecedents_id' })
  antecedentsId!: string;

  @Column({ name: 'consultation_id', type: 'uuid' })
  consultationId!: string;

  @Column({ type: 'text', nullable: true })
  breastfeeding!: string | null;

  @Column({ name: 'bottle_feeding', type: 'text', nullable: true })
  bottleFeeding!: string | null;

  @Column({ name: 'feeding_frequency', type: 'text', nullable: true })
  feedingFrequency!: string | null;

  @Column({
    name: 'complementary_feeding_start_months',
    type: 'integer',
    nullable: true,
  })
  complementaryFeedingStartMonths!: number | null;

  @Column({ name: 'food_frequency_by_group', type: 'jsonb', nullable: true })
  foodFrequencyByGroup!: Record<string, unknown> | null;

  @Column({
    name: 'meals_per_day',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  mealsPerDay!: string | null;

  @Column({ name: 'meal_schedule', type: 'jsonb', nullable: true })
  mealSchedule!: Record<string, unknown> | null;

  @Column({ name: 'habitual_schedule', type: 'text', nullable: true })
  habitualSchedule!: string | null;

  @Column({ name: 'recall_24h', type: 'jsonb', nullable: true })
  recall24h!: Record<string, unknown> | null;

  @Column({
    name: 'added_sugar_salt',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  addedSugarSalt!: string | null;

  @Column({ name: 'added_sugar_salt_frequency', type: 'text', nullable: true })
  addedSugarSaltFrequency!: string | null;

  @Column({
    name: 'appetite_level',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  appetiteLevel!: string | null;

  @Column({ name: 'water_glasses_per_day', type: 'integer', nullable: true })
  waterGlassesPerDay!: number | null;

  @Column({
    name: 'food_allergies_or_intolerances',
    type: 'text',
    nullable: true,
  })
  foodAllergiesOrIntolerances!: string | null;

  @Column({ name: 'current_supplementation', type: 'jsonb', nullable: true })
  currentSupplementation!: Record<string, unknown> | null;

  @Column({
    name: 'current_supplementation_other',
    type: 'text',
    nullable: true,
  })
  currentSupplementationOther!: string | null;

  @Column({ name: 'deworming_last_date', type: 'date', nullable: true })
  dewormingLastDate!: string | null;

  @Column({ name: 'current_medications', type: 'text', nullable: true })
  currentMedications!: string | null;

  @Column({ name: 'recent_illnesses', type: 'jsonb', nullable: true })
  recentIllnesses!: Record<string, unknown> | null;

  @Column({ name: 'recent_illnesses_other', type: 'text', nullable: true })
  recentIllnessesOther!: string | null;

  @Column({
    name: 'vaccination_status',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  vaccinationStatus!: string | null;

  @Column({
    name: 'safe_water_access',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  safeWaterAccess!: string | null;

  @Column({
    name: 'basic_sanitation',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  basicSanitation!: string | null;

  @Column({
    name: 'food_insecurity_concern',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  foodInsecurityConcern!: string | null;

  @Column({
    name: 'food_insecurity_meal_skip',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  foodInsecurityMealSkip!: string | null;

  @Column({
    name: 'primary_caregiver',
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  primaryCaregiver!: string | null;

  @Column({
    name: 'daycare_attendance',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  daycareAttendance!: string | null;

  @Column({ name: 'sleep_average_hours', ...numericColumn(4, 2, true) })
  sleepAverageHours!: string | null;

  @Column({ name: 'sleep_quality', type: 'text', nullable: true })
  sleepQuality!: string | null;

  @Column({ name: 'bedtime', type: 'time without time zone', nullable: true })
  bedtime!: string | null;

  @Column({
    name: 'wakeup_time',
    type: 'time without time zone',
    nullable: true,
  })
  wakeupTime!: string | null;

  @Column({ name: 'complementary_feeding_start', type: 'text', nullable: true })
  complementaryFeedingStart!: string | null;

  @Column({ name: 'consumed_foods', type: 'text', nullable: true })
  consumedFoods!: string | null;

  @Column({ name: 'daily_food_quantity', type: 'text', nullable: true })
  dailyFoodQuantity!: string | null;

  @Column({ name: 'average_sleep_hours', ...numericColumn(4, 2, true) })
  averageSleepHours!: string | null;

  @Column({ name: 'sleep_routine', type: 'text', nullable: true })
  sleepRoutine!: string | null;

  @Column({ type: 'text', nullable: true })
  observations!: string | null;

  @OneToOne(() => Consultation, (consultation) => consultation.antecedent, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'consultation_id',
    referencedColumnName: 'consultationId',
  })
  consultation!: Consultation;
}
