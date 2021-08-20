import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addDatesTransfers1629481325260 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("transfers", [
      new TableColumn({
        name: "created_at",
        type: "timestamp",
        default: "now()",
      }),
      new TableColumn({
        name: "updated_at",
        type: "timestamp",
        default: "now()",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns("transfers", [
      new TableColumn({
        name: "created_at",
        type: "timestamp",
        default: "now()",
      }),
      new TableColumn({
        name: "updated_at",
        type: "timestamp",
        default: "now()",
      }),
    ]);
  }
}
