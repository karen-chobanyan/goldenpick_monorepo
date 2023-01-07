import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'bson';
import { Role } from 'src/roles/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async get(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async create(data: Role): Promise<Role> {
    return this.roleRepository.save(data);
  }

  async update(roleData: Role): Promise<Role> {
    return this.roleRepository.save({
      ...roleData,
      _id: new ObjectID(roleData._id),
    });
  }

  async getRole(_id): Promise<Role> {
    return this.roleRepository.findOne(_id);
  }

  async delete(role): Promise<any> {
    return this.roleRepository.delete({ _id: new ObjectID(role._id) });
  }
}
