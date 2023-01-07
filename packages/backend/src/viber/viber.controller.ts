import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ViberService } from './viber.service';
import { UpdateViberDto } from './dto/update-viber.dto';
import { viberBot } from 'src/main';
import { Message } from 'viber-bot';
import { FilesService } from 'src/files/files.service';
import { CurrentUser } from 'src/auth/user.decorator';
import { AuthGuard } from '@nestjs/passport';

const TextMessage = Message.Text;
const PictureMessage = Message.Picture;
const VideoMessage = Message.Video;

@Controller('viber')
export class ViberController {
  constructor(
    private readonly viberService: ViberService,
    private readonly filesService: FilesService,
  ) {}

  @Post('proad-cast')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() message: any, @CurrentUser() user) {
    const text = message.description;
    user.owner = user.owner || user._id;
    const profiles = await this.viberService.findAll();

    const imgs = message.attachments.length
      ? await this.filesService.upload(message.attachments, user)
      : [];
    profiles.forEach((profile) => {
      if (!message.exclude[profile.id]) {
        for (let i = 0; i < message.attachments.length; i++) {
          if (imgs[i] && imgs[i].type === 'mp4') {
            viberBot.sendMessage(profile, [
              new VideoMessage(imgs[i].url, 64000),
            ]);
          } else if (imgs[i] && imgs[i].type !== 'mp4') {
            viberBot.sendMessage(profile, [new PictureMessage(imgs[i].url)]);
          }
        }
        viberBot.sendMessage(profile, [new TextMessage(text)]);
      }
    });

    return { sent: true };
  }

  @Get()
  findAll() {
    return this.viberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viberService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViberDto: UpdateViberDto) {
    return this.viberService.update(+id, updateViberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viberService.remove(+id);
  }
}
