import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'bson';
import { Gem } from 'src/gems/gem.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GemsService {
  constructor(
    @InjectRepository(Gem)
    private readonly gemRepository: Repository<Gem>,
  ) {}

  async get(): Promise<Gem[]> {
    return this.gemRepository.find();
  }

  async getGem(_id): Promise<Gem> {
    return this.gemRepository.findOne(_id);
  }

  async create(data: Gem): Promise<Gem> {
    return this.gemRepository.save(data);
  }

  async update(data: Gem): Promise<Gem> {
    return this.gemRepository.save({
      ...data,
      _id: new ObjectID(data._id),
    });
  }

  async delete(gem): Promise<any> {
    return this.gemRepository.delete({ _id: new ObjectID(gem._id) });
  }
}
