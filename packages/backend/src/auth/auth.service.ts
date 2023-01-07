import { Injectable, Logger } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { sign, verify } from 'jsonwebtoken';
import { ObjectID, ObjectId } from 'bson';

@Injectable()
export class AuthService {
  private saltRounds = 12;
  logger = new Logger('Auth');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async getUserById(_id): Promise<User> {
    return await this.userRepository.findOne(_id);
  }

  async createUser(user: User): Promise<User> {
    if (user.password) {
      user.passwordHash = await this.getHash(user.password);
    }
    user.password = undefined;
    user.settings = {
      language: 'en',
      currency: [],
    };
    return this.userRepository.save(user);
  }

  async updateUser(user: User) {
    if (user.password && user.password !== '') {
      user.passwordHash = await this.getHash(user.password);
      const { password, _id, ...res } = user;
      return this.userRepository.update(user._id, res);
    } else {
      const { password, _id, passwordHash, ...res } = user;
      return this.userRepository.update(user._id, res);
    }
  }

  async getHash(password: string | undefined): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(
    password: string | undefined,
    hash: string | undefined,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async createToken(user) {
    const token = this.jwtService.sign(user);
    const refreshToken = sign(
      { isRefreshToken: true, userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXP_IN },
    );
    return {
      token,
      refreshToken,
      user,
      status: 200,
      message: 'Token created successfully.',
    };
  }

  async validateUser(email): Promise<boolean> {
    if (email) {
      return Boolean(await this.getUserByEmail(email));
    }
    return false;
  }

  async verifyRefreshToken(token) {
    try {
      const data: any = verify(
        token.refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      if (data.isRefreshToken && data.userId !== '') {
        const user = await this.userRepository.findOne({ _id: data.userId });
        const { passwordHash, ...result } = user;
        const token = this.jwtService.sign(result);
        const refreshToken = sign(
          { isRefreshToken: true, userId: data._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: process.env.REFRESH_TOKEN_EXP_IN },
        );
        return {
          token,
          refreshToken,
          user,
          status: 200,
          message: 'Token created successfully.',
        };
      }
    } catch (error) {
      return {
        status: '401',
        message: 'Error validating refresh token: Session has expired.',
      };
    }
  }

  async delete(user): Promise<any> {
    return this.userRepository.delete({ _id: new ObjectID(user._id) });
  }
}
