import {MigrationInterface, QueryRunner} from "typeorm";

export class userMigration1619525401061 implements MigrationInterface {
    name = 'userMigration1619525401061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(500) NULL, `fname` varchar(50) NOT NULL, `lname` varchar(50) NOT NULL, `role` varchar(50) NULL DEFAULT 'Manager', `owner` int NULL DEFAULT '0', `passwordHash` varchar(100) NULL, UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`");
        await queryRunner.query("DROP TABLE `user`");
    }

}
