import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from 'src/files/files.module';
import { FilesService } from 'src/files/files.service';
import { Gem } from 'src/gems/gem.entity';
import { PublicFile } from 'src/files/publicFile.entity';
import { GemsController } from './gems.controller';
import { GemsService } from './gems.service';

@Module({
  imports: [
    FilesModule,
    TypeOrmModule.forFeature([Gem]),
    TypeOrmModule.forFeature([PublicFile]),
  ],
  controllers: [GemsController],
  providers: [GemsService, FilesService],
})
export class GemsModule {}
