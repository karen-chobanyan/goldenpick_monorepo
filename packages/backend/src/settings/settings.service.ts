import { Injectable } from '@nestjs/common';
import { Settings } from 'src/settings/settings.entity';
import { ObjectID } from 'bson';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) {}

  async get(owner): Promise<Settings> {
    return this.settingsRepository.findOne({ where: { owner } });
  }

  async create(data: Settings): Promise<Settings> {
    return this.settingsRepository.save(data);
  }

  async update(settingsData: Settings): Promise<Settings> {
    return this.settingsRepository.save({
      ...settingsData,
      _id: new ObjectID(settingsData._id),
    });
  }
}
