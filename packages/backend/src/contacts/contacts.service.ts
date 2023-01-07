import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'bson';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async getContacts(): Promise<Contact[]> {
    return this.contactRepository.find({ order: { fname: 'ASC' } });
  }

  async createContact(contactData: Contact): Promise<Contact> {
    return this.contactRepository.save(contactData);
  }

  async updateContact(contactData: Contact): Promise<Contact> {
    return this.contactRepository.save({
      ...contactData,
      _id: new ObjectID(contactData._id),
    });
  }

  async delete(contact): Promise<any> {
    return this.contactRepository.delete({ _id: new ObjectID(contact._id) });
  }
}
