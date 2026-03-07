import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNutrisemSchema1741305600000 implements MigrationInterface {
  name = 'CreateNutrisemSchema1741305600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(
      `CREATE TYPE "user_role" AS ENUM ('admin', 'clinician', 'patient')`,
    );
    await queryRunner.query(`CREATE TYPE "gender" AS ENUM ('male', 'female')`);
    await queryRunner.query(
      `CREATE TYPE "report_format" AS ENUM ('PDF', 'EXCEL')`,
    );

    await queryRunner.query(`
      CREATE TABLE "users" (
        "user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "first_name" varchar(120) NOT NULL,
        "last_name" varchar(120) NOT NULL,
        "identity_number" varchar(32) NOT NULL UNIQUE,
        "email" varchar(255),
        "phone" varchar(30) NOT NULL,
        "address" varchar(255) NOT NULL,
        "profile_photo" varchar(512),
        "role" "user_role" NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_users_email" ON "users" ("email") WHERE "email" IS NOT NULL`,
    );

    await queryRunner.query(`
      CREATE TABLE "clinicians" (
        "clinician_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL UNIQUE,
        "professional_license" varchar(64) NOT NULL UNIQUE,
        "profession" varchar(120) NOT NULL,
        "specialty" varchar(120) NOT NULL,
        "residence" varchar(120) NOT NULL,
        "institution" varchar(160) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_clinicians_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "patients" (
        "patient_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL UNIQUE,
        "first_name" varchar(120) NOT NULL,
        "last_name" varchar(120) NOT NULL,
        "identity_number" varchar(32) NOT NULL UNIQUE,
        "birth_date" date NOT NULL,
        "gender" "gender" NOT NULL,
        "address" varchar(255) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_patients_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "guardians" (
        "guardian_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id" uuid NOT NULL,
        "first_name" varchar(120) NOT NULL,
        "last_name" varchar(120) NOT NULL,
        "identity_number" varchar(32) NOT NULL,
        "address" varchar(255) NOT NULL,
        "phone" varchar(30) NOT NULL,
        "relationship" varchar(80) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_guardians_patient_id" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_guardians_patient_identity_number" ON "guardians" ("patient_id", "identity_number")`,
    );

    await queryRunner.query(`
      CREATE TABLE "patient_clinicians" (
        "patient_clinician_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id" uuid NOT NULL,
        "clinician_id" uuid NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_patient_clinicians_patient_id" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE,
        CONSTRAINT "fk_patient_clinicians_clinician_id" FOREIGN KEY ("clinician_id") REFERENCES "clinicians"("clinician_id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_patient_clinicians_patient_id_clinician_id" ON "patient_clinicians" ("patient_id", "clinician_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "consultations" (
        "consultation_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id" uuid NOT NULL,
        "clinician_id" uuid NOT NULL,
        "consultation_date" date NOT NULL,
        "consultation_time" time without time zone NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_consultations_patient_id" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE,
        CONSTRAINT "fk_consultations_clinician_id" FOREIGN KEY ("clinician_id") REFERENCES "clinicians"("clinician_id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_consultations_patient_clinician_date_time" ON "consultations" ("patient_id", "clinician_id", "consultation_date", "consultation_time")`,
    );
    await queryRunner.query(
      `CREATE INDEX "ix_consultations_patient_id" ON "consultations" ("patient_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "ix_consultations_clinician_id" ON "consultations" ("clinician_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "histories" (
        "history_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id" uuid NOT NULL,
        "creation_date" timestamptz NOT NULL,
        "consultation_id" uuid,
        "clinician_id" uuid,
        "summary" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_histories_patient_id" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE,
        CONSTRAINT "fk_histories_consultation_id" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("consultation_id") ON DELETE SET NULL,
        CONSTRAINT "fk_histories_clinician_id" FOREIGN KEY ("clinician_id") REFERENCES "clinicians"("clinician_id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "ix_histories_patient_id" ON "histories" ("patient_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "ix_histories_consultation_id" ON "histories" ("consultation_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "ix_histories_clinician_id" ON "histories" ("clinician_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "patient_progress" (
        "progress_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "patient_id" uuid NOT NULL,
        "progress_date" date NOT NULL,
        "weight_kg" numeric(5,2) NOT NULL,
        "height_cm" numeric(5,2) NOT NULL,
        "bmi" numeric(5,2) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_patient_progress_patient_id" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE,
        CONSTRAINT "ck_patient_progress_weight_kg_positive" CHECK ("weight_kg" > 0),
        CONSTRAINT "ck_patient_progress_height_cm_positive" CHECK ("height_cm" > 0),
        CONSTRAINT "ck_patient_progress_bmi_positive" CHECK ("bmi" > 0)
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_patient_progress_patient_id_progress_date" ON "patient_progress" ("patient_id", "progress_date")`,
    );

    await queryRunner.query(`
      CREATE TABLE "anthropometric_data" (
        "anthropometric_data_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "consultation_id" uuid NOT NULL UNIQUE,
        "weight_kg" numeric(5,2) NOT NULL,
        "height_m" numeric(4,2) NOT NULL,
        "muac_cm" numeric(5,2) NOT NULL,
        "head_circumference_cm" numeric(5,2) NOT NULL,
        "bmi" numeric(5,2),
        "z_score" numeric(5,2),
        "percentile" numeric(5,2),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_anthropometric_data_consultation_id" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("consultation_id") ON DELETE CASCADE,
        CONSTRAINT "ck_anthropometric_data_weight_kg_positive" CHECK ("weight_kg" > 0),
        CONSTRAINT "ck_anthropometric_data_height_m_positive" CHECK ("height_m" > 0),
        CONSTRAINT "ck_anthropometric_data_muac_cm_positive" CHECK ("muac_cm" > 0),
        CONSTRAINT "ck_anthropometric_data_head_circumference_cm_positive" CHECK ("head_circumference_cm" > 0),
        CONSTRAINT "ck_anthropometric_data_bmi_non_negative" CHECK ("bmi" IS NULL OR "bmi" >= 0),
        CONSTRAINT "ck_anthropometric_data_percentile_range" CHECK ("percentile" IS NULL OR "percentile" BETWEEN 0 AND 100)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "clinical_data" (
        "clinical_data_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "consultation_id" uuid NOT NULL UNIQUE,
        "main_consultation_reason" text,
        "informant_type" varchar(80),
        "informant_name" varchar(160),
        "informant_relationship" varchar(80),
        "alarm_signs" jsonb,
        "birth_weight_kg" numeric(4,2),
        "gestational_age_weeks" integer,
        "prematurity" varchar(80),
        "activity_level" jsonb,
        "apathy" jsonb,
        "general_observations" text,
        "hair_condition" jsonb,
        "skin_condition" jsonb,
        "edema" jsonb,
        "bilateral_edema_grade" varchar(80),
        "dentition" jsonb,
        "physical_observations" text,
        "diarrhea" text,
        "vomiting" text,
        "dehydration" jsonb,
        "digestive_observations" text,
        "temperature_celsius" numeric(4,1),
        "temperature_observation" text,
        "heart_rate" integer,
        "heart_rate_observation" text,
        "respiratory_rate" integer,
        "respiratory_rate_observation" text,
        "blood_pressure_systolic" integer,
        "blood_pressure_diastolic" integer,
        "blood_pressure" varchar(80),
        "blood_pressure_observation" text,
        "observations" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_clinical_data_consultation_id" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("consultation_id") ON DELETE CASCADE,
        CONSTRAINT "ck_clinical_data_temperature_non_negative" CHECK ("temperature_celsius" IS NULL OR "temperature_celsius" >= 0),
        CONSTRAINT "ck_clinical_data_heart_rate_non_negative" CHECK ("heart_rate" IS NULL OR "heart_rate" >= 0),
        CONSTRAINT "ck_clinical_data_respiratory_rate_non_negative" CHECK ("respiratory_rate" IS NULL OR "respiratory_rate" >= 0),
        CONSTRAINT "ck_clinical_data_blood_pressure_values" CHECK (("blood_pressure_systolic" IS NULL OR "blood_pressure_systolic" >= 0) AND ("blood_pressure_diastolic" IS NULL OR "blood_pressure_diastolic" >= 0))
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "antecedents" (
        "antecedents_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "consultation_id" uuid NOT NULL UNIQUE,
        "breastfeeding" text,
        "bottle_feeding" text,
        "feeding_frequency" text,
        "complementary_feeding_start_months" integer,
        "food_frequency_by_group" jsonb,
        "meals_per_day" varchar(80),
        "meal_schedule" jsonb,
        "habitual_schedule" text,
        "recall_24h" jsonb,
        "added_sugar_salt" varchar(80),
        "added_sugar_salt_frequency" text,
        "appetite_level" varchar(80),
        "water_glasses_per_day" integer,
        "food_allergies_or_intolerances" text,
        "current_supplementation" jsonb,
        "current_supplementation_other" text,
        "deworming_last_date" date,
        "current_medications" text,
        "recent_illnesses" jsonb,
        "recent_illnesses_other" text,
        "vaccination_status" varchar(80),
        "safe_water_access" varchar(80),
        "basic_sanitation" varchar(80),
        "food_insecurity_concern" varchar(80),
        "food_insecurity_meal_skip" varchar(80),
        "primary_caregiver" varchar(120),
        "daycare_attendance" varchar(80),
        "sleep_average_hours" numeric(4,2),
        "sleep_quality" text,
        "bedtime" time without time zone,
        "wakeup_time" time without time zone,
        "complementary_feeding_start" text,
        "consumed_foods" text,
        "daily_food_quantity" text,
        "average_sleep_hours" numeric(4,2),
        "sleep_routine" text,
        "observations" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_antecedents_consultation_id" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("consultation_id") ON DELETE CASCADE,
        CONSTRAINT "ck_antecedents_water_glasses_per_day_non_negative" CHECK ("water_glasses_per_day" IS NULL OR "water_glasses_per_day" >= 0),
        CONSTRAINT "ck_antecedents_sleep_average_hours_range" CHECK ("sleep_average_hours" IS NULL OR "sleep_average_hours" BETWEEN 0 AND 24),
        CONSTRAINT "ck_antecedents_average_sleep_hours_range" CHECK ("average_sleep_hours" IS NULL OR "average_sleep_hours" BETWEEN 0 AND 24)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "diagnoses" (
        "diagnosis_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "consultation_id" uuid NOT NULL UNIQUE,
        "medical_history_id" uuid NOT NULL,
        "bmi" numeric(5,2) NOT NULL,
        "z_score_percentile" numeric(6,2) NOT NULL,
        "nutritional_diagnosis" text NOT NULL,
        "diagnosis_details" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_diagnoses_consultation_id" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("consultation_id") ON DELETE CASCADE,
        CONSTRAINT "fk_diagnoses_medical_history_id" FOREIGN KEY ("medical_history_id") REFERENCES "histories"("history_id") ON DELETE RESTRICT,
        CONSTRAINT "ck_diagnoses_bmi_positive" CHECK ("bmi" > 0)
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "ix_diagnoses_medical_history_id" ON "diagnoses" ("medical_history_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "recommendations" (
        "recommendation_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "diagnosis_id" uuid NOT NULL,
        "medical_recommendation" text NOT NULL,
        "dietary_recommendation" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_recommendations_diagnosis_id" FOREIGN KEY ("diagnosis_id") REFERENCES "diagnoses"("diagnosis_id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "ix_recommendations_diagnosis_id" ON "recommendations" ("diagnosis_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "foods" (
        "food_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "food_name" varchar(120) NOT NULL,
        "category" varchar(100) NOT NULL,
        "energy_kcal" numeric(8,2) NOT NULL,
        "protein_g" numeric(8,2) NOT NULL,
        "fat_g" numeric(8,2) NOT NULL,
        "carbohydrates_g" numeric(8,2) NOT NULL,
        "fiber_g" numeric(8,2) NOT NULL,
        "vitamins" text NOT NULL,
        "minerals" text NOT NULL,
        "serving_size" varchar(120),
        "allergens" text,
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "ck_foods_energy_kcal_non_negative" CHECK ("energy_kcal" >= 0),
        CONSTRAINT "ck_foods_protein_g_non_negative" CHECK ("protein_g" >= 0),
        CONSTRAINT "ck_foods_fat_g_non_negative" CHECK ("fat_g" >= 0),
        CONSTRAINT "ck_foods_carbohydrates_g_non_negative" CHECK ("carbohydrates_g" >= 0),
        CONSTRAINT "ck_foods_fiber_g_non_negative" CHECK ("fiber_g" >= 0)
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_foods_food_name_category" ON "foods" ("food_name", "category")`,
    );

    await queryRunner.query(`
      CREATE TABLE "recommendation_foods" (
        "recommendation_food_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "recommendation_id" uuid NOT NULL,
        "food_id" uuid NOT NULL,
        "daily_amount" varchar(120) NOT NULL,
        "reference_age" varchar(120) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_recommendation_foods_recommendation_id" FOREIGN KEY ("recommendation_id") REFERENCES "recommendations"("recommendation_id") ON DELETE CASCADE,
        CONSTRAINT "fk_recommendation_foods_food_id" FOREIGN KEY ("food_id") REFERENCES "foods"("food_id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_recommendation_foods_recommendation_id_food_id" ON "recommendation_foods" ("recommendation_id", "food_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "reports" (
        "report_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "report_type" varchar(80) NOT NULL,
        "format" "report_format" NOT NULL,
        "analysis_period" varchar(120) NOT NULL,
        "generation_date" timestamptz NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_reports_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "ix_reports_user_id_generation_date" ON "reports" ("user_id", "generation_date")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "reports"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "recommendation_foods"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "foods"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "recommendations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "diagnoses"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "antecedents"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "clinical_data"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "anthropometric_data"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "patient_progress"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "histories"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "consultations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "patient_clinicians"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "guardians"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "patients"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "clinicians"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);

    await queryRunner.query(`DROP TYPE IF EXISTS "report_format"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "gender"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role"`);
  }
}
