import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/user.decorator';


@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactService: ContactsService) {}

  @Post()
  async createContact(@Body() data) {
    let contact;
    if (!data._id) {
      contact = await this.contactService.createContact(data);
    } else {
      contact = await this.contactService.updateContact(data);
    }
    return contact;
  }

  @Get()
  async getContacts() {
    return await this.contactService.getContacts();
  }

  @Post('update')
  async updateContact(@Req() data) {
    const contact = await this.contactService.updateContact(data.body.contact);
    return contact;
  }

  @Post('delete')
  @UseGuards(AuthGuard('jwt'))
  async deleteContact(@Body() data, @CurrentUser() user) {
    const contact = await this.contactService.delete(data);
    return contact;
  }
}
