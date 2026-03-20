import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePasswordResets1760000000000 implements MigrationInterface {
  name = 'CreatePasswordResets1760000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "password_resets" (
        "password_reset_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "code_hash" varchar(255) NOT NULL,
        "delivery_channel" varchar(80) NOT NULL,
        "expires_at" timestamptz NOT NULL,
        "used_at" timestamptz,
        "attempts" int NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "fk_password_resets_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "ix_password_resets_user_id" ON "password_resets" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "ix_password_resets_user_active" ON "password_resets" ("user_id", "used_at", "expires_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "password_resets"`);
  }
}
