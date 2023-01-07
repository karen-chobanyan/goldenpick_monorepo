import { Module } from '@nestjs/common';
import { ViberService } from './viber.service';
import { ViberController } from './viber.controller';
import { Viber } from './viber.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { PublicFile } from 'src/files/publicFile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Viber, PublicFile])],
  controllers: [ViberController],
  providers: [ViberService, FilesService],
})
export class ViberModule {}
