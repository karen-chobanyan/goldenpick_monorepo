import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/user.decorator';
import { FilesService } from 'src/files/files.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly filesService: FilesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createContact(@CurrentUser() user, @Req() data) {
    let us_er;
    if (!data.body._id) {
      const imgs = data.body.images.length
        ? await this.filesService.upload(data.body.images, user)
        : [];

      data.body.images = imgs;
      data.body.owner = !user.owner ? user._id : user.owner;

      us_er = await this.userService.create(data.body);
    } else {
      const imgs = await this.filesService.upload(data.body.images, user);
      if (imgs.length) {
        data.body.images = imgs;
      }
      us_er = await this.userService.update(data.body);
    }
    return us_er;
  }

  @Get()
  async getusers() {
    return await this.userService.get();
  }

  @Get(':id')
  async getuser(@Param('id') id) {
    return await this.userService.getUser(id);
  }

  @Post('update')
  async updateUsers(@Req() data) {
    const contact = await this.userService.update(data.body.contact);
    return contact;
  }
}
