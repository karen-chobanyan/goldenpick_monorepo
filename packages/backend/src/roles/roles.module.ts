import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/role.entity';
import { FilesService } from 'src/files/files.service';
import { PublicFile } from 'src/files/publicFile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, PublicFile])],
  providers: [RolesService, FilesService],
  controllers: [RolesController],
})
export class RolesModule {}
