import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/user.decorator';
import { FilesService } from 'src/files/files.service';
import { MetalsService } from './metals.service';

@Controller('metals')
export class MetalsController {
  constructor(
    private readonly metalService: MetalsService,
    private readonly filesService: FilesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createContact(@CurrentUser() user, @Req() data) {
    let metal;
    if (!data.body._id) {
      const imgs = data.body.images.length
        ? await this.filesService.upload(data.body.images, user)
        : [];

      data.body.images = imgs;
      data.body.owner = !user.owner ? user._id : user.owner;

      metal = await this.metalService.create(data.body);
    } else {
      const imgs = await this.filesService.upload(data.body.images, user);
      if (imgs.length) {
        data.body.images = imgs;
      }
      metal = await this.metalService.update(data.body);
    }
    return metal;
  }

  @Get()
  async getMetals() {
    return await this.metalService.get();
  }

  @Get(':id')
  async getMetal(@Param('id') id) {
    return await this.metalService.getMetal(id);
  }

  @Post('update')
  async updateMetals(@Req() data) {
    const contact = await this.metalService.update(data.body.contact);
    return contact;
  }

  @Post('delete')
  @UseGuards(AuthGuard('jwt'))
  async deleteMetal(@Body() data, @CurrentUser() user) {
    const metal = await this.metalService.delete(data);
    return metal;
  }
}
