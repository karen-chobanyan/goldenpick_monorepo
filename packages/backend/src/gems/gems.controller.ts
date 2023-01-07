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
import { GemsService } from './gems.service';

@Controller('gems')
export class GemsController {
  constructor(
    private readonly gemService: GemsService,
    private readonly filesService: FilesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createContact(@CurrentUser() user, @Req() data) {
    let gem;
    if (!data.body._id) {
      const imgs = data.body.images.length
        ? await this.filesService.upload(data.body.images, user)
        : [];

      data.body.images = imgs;
      data.body.owner = !user.owner ? user._id : user.owner;

      gem = await this.gemService.create(data.body);
    } else {
      const imgs = await this.filesService.upload(data.body.images, user);
      if (imgs.length) {
        data.body.images = imgs;
      }
      gem = await this.gemService.update(data.body);
    }
    return gem;
  }

  @Get()
  async getMetals() {
    return await this.gemService.get();
  }

  @Get(':id')
  async getMetal(@Param('id') id) {
    return await this.gemService.getGem(id);
  }

  @Post('update')
  async updateMetals(@Req() data) {
    const contact = await this.gemService.update(data.body.contact);
    return contact;
  }

  @Post('delete')
  @UseGuards(AuthGuard('jwt'))
  async deleteGem(@Body() data, @CurrentUser() user) {
    const gem = await this.gemService.delete(data);
    return gem;
  }
}
