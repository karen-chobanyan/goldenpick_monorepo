import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'aws-sdk';
import { PublicFile } from 'src/files/publicFile.entity';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile])],
  providers: [FilesService, ConfigService],
  exports: [ConfigService],
})
export class FilesModule {}
