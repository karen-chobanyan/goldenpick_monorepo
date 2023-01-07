import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getUsers() {
    const users = await this.authService.getUsers();
    return users;
  }

  @Get(':id')
  async getUser(@Param('id') _id) {
    return _id ? await this.authService.getUserById(_id) : null;
  }

  @Post('login')
  async loginUser(@Req() data) {
    if (!(data.body && data.body.email && data.body.password)) {
      return { errors: [], message: 'Username and password are required!' };
    }

    const user = await this.authService.getUserByEmail(data.body.email);
    if (user) {
      const { password, passwordHash, ...result } = user;
      if (
        await this.authService.compareHash(
          data.body.password,
          user.passwordHash,
        )
      ) {
        return await this.authService.createToken(result);
      }
    }

    return {
      error: [{ type: 401, message: 'Username or password wrong!' }],
    };
  }

  @Post('register')
  @UseGuards(AuthGuard('jwt'))
  async registerUser(@Req() data, @CurrentUser() u) {
    let user: any = {};

    if (!data.body._id) {
      if (!(data.body && data.body.email && data.body.password)) {
        return { message: 'Email and password are required!' };
      } else {
        user = await this.authService.getUserByEmail(data.body.email);
        if (user) {
          return { message: 'User with this Email already exists!' };
        } else {
          data.body.owner = !u.owner ? u._id : u.owner;
          user = await this.authService.createUser(data.body);
          if (user) {
            user.passwordHash = undefined;
          }
        }
      }
    } else {
      if (!data.body.email) {
        return { message: 'Email are required!' };
      } else {
        const updatedEmail = await this.authService.getUserByEmail(
          data.body.email,
        );
        if (updatedEmail && updatedEmail._id.toHexString() !== data.body._id) {
          return { message: 'User with this Email already exists!' };
        }
        user = await this.authService.updateUser(data.body);
      }
    }

    return { ...user, status: 200 };
  }

  @Post('accesstoken')
  @UseGuards(AuthGuard('jwt'))
  async whoAmI(@Req() req, @CurrentUser() user) {
    const { iat, exp, ...userObj } = user;
    return {
      user,
      token: await this.authService.createToken(userObj),
    };
  }

  @Post('verifyEmail')
  async verifyEmail(email) {
    return await this.authService.validateUser(email);
  }

  @Post('newToken')
  async verifyRefreshToken(token) {
    return await this.authService.verifyRefreshToken(token);
  }

  @Post('delete')
  @UseGuards(AuthGuard('jwt'))
  async deleteGem(@Body() data, @CurrentUser() user) {
    const us = await this.authService.delete(data);
    return us;
  }
}
