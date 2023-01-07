import { Injectable } from '@nestjs/common';
import { Metal } from 'src/metals/metal.entity';
import { ObjectID } from 'bson';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetalsService {
  constructor(
    @InjectRepository(Metal)
    private readonly metalRepository: Repository<Metal>,
  ) {}

  async get(): Promise<Metal[]> {
    return this.metalRepository.find();
  }

  async getMetal(_id): Promise<Metal> {
    return this.metalRepository.findOne(_id);
  }

  async create(data: Metal): Promise<Metal> {
    return this.metalRepository.save(data);
  }

  async update(data: Metal): Promise<Metal> {
    return this.metalRepository.save({
      ...data,
      _id: new ObjectID(data._id),
    });
  }

  async delete(metal): Promise<any> {
    return this.metalRepository.delete({ _id: new ObjectID(metal._id) });
  }
}
