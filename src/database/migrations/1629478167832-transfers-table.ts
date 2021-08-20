import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class transfersTable1629478167832 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "transfers",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "sender_id",
            type: "uuid",
          },
          {
            name: "receiver_id",
            type: "uuid",
          },
          {
            name: "amount",
            type: "decimal",
            precision: 5,
            scale: 2,
          },
          {
            name: "description",
            type: "varchar",
          },
        ],
        foreignKeys: [
          {
            name: "FKSender",
            columnNames: ["sender_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          },
          {
            name: "FKReceiver",
            columnNames: ["receiver_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("transfers");
  }
}
