import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { ObjectID } from 'bson';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async get(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUser(_id): Promise<User> {
    return this.userRepository.findOne(_id);
  }

  async create(data: User): Promise<User> {
    return this.userRepository.save(data);
  }

  async update(data: User): Promise<User> {
    return this.userRepository.save({
      ...data,
      _id: new ObjectID(data._id),
    });
  }
}
