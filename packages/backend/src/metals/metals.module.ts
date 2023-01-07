import { Module } from '@nestjs/common';
import { MetalsService } from './metals.service';
import { MetalsController } from './metals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Metal } from 'src/metals/metal.entity';
import { FilesService } from 'src/files/files.service';
import { ConfigService } from 'aws-sdk';
import { PublicFile } from 'src/files/publicFile.entity';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    FilesModule,
    TypeOrmModule.forFeature([Metal]),
    TypeOrmModule.forFeature([PublicFile]),
  ],
  providers: [MetalsService, FilesService],
  controllers: [MetalsController],
})
export class MetalsModule {}
