import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/user.decorator';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async saveSettings(@Body() data, @CurrentUser() user) {
    data.owner = !user.owner ? user._id : user.owner;
    const settigs = await this.settingsService.get(data.owner);

    let settingsData;
    if (settigs == undefined) {
      settingsData = await this.settingsService.create(data);
    } else {
      settingsData = await this.settingsService.update(data);
    }
    return settingsData;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getSettings(@CurrentUser() user) {
    const owner = !user.owner ? user._id : user.owner;
    return await this.settingsService.get(owner);
  }
}
