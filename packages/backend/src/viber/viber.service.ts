import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateViberDto } from './dto/create-viber.dto';
import { UpdateViberDto } from './dto/update-viber.dto';
import { Viber } from './viber.entity';

@Injectable()
export class ViberService {
  constructor(
    @InjectRepository(Viber)
    private readonly viberRepository: Repository<Viber>,
  ) {}

  create(createViberDto: CreateViberDto) {
    return 'This action adds a new viber';
  }

  findAll() {
    return this.viberRepository.find();
  }

  async findOne(id: string) {
    return this.viberRepository.findOne({ id });
  }

  update(id: number, updateViberDto: UpdateViberDto) {
    return `This action updates a #${id} viber`;
  }

  remove(id: number) {
    return `This action removes a #${id} viber`;
  }

  async checkSave(profile: Viber) {
    let isNew = false;
    const prof = await this.viberRepository.findOne({ id: profile.id });
    if (!prof) {
      isNew = true;
      this.viberRepository.save({ ...profile });
    }
    return isNew;
  }

  async delete(id) {
    this.viberRepository.delete({ id });
  }
}
