import {
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Body,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/user.decorator';
import { RolesService } from './roles.service';
import { FilesService } from 'src/files/files.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createRole(@Body() data, @CurrentUser() user) {
    data.owner = !user.owner ? user._id : user.owner;
    let role;
    if (!data._id) {
      data.owner = !user.owner ? user._id : user.owner;
      role = await this.roleService.create(data);
    } else {
      role = await this.roleService.update(data);
    }
    return role;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getRoles(@Req() data, @CurrentUser() user) {
    const role = await this.roleService.get();
    return role;
  }

  @Post('delete')
  @UseGuards(AuthGuard('jwt'))
  async deleteGem(@Body() data, @CurrentUser() user) {
    const role = await this.roleService.delete(data);
    return role;
  }
}
