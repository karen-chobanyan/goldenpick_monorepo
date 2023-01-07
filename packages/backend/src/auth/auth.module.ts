import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    ConfigModule.forRoot({
      envFilePath: '../.env',
    }),
    JwtModule.register({
      secret:
        'b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABCDjeVqSy',
      signOptions: { expiresIn: process.env.EXP_IN },
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
