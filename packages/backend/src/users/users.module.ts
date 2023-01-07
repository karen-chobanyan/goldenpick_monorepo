import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { FilesService } from 'src/files/files.service';
import { ConfigService } from 'aws-sdk';
import { PublicFile } from 'src/files/publicFile.entity';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    FilesModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([PublicFile]),
  ],
  providers: [UsersService, FilesService],
  controllers: [UsersController],
})
export class UsersModule {}
