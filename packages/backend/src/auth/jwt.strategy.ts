import * as passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends Strategy {
  constructor(private readonly authService: AuthService) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true,
        secretOrKey:
          'b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABCDjeVqSy',
      },
      async (req, payload, next) => await this.verify(req, payload, next),
    );
    passport.use(this);
  }

  public async verify(req, payload, done) {
    const isValid = await this.authService.validateUser(payload.email);
    if (!isValid) {
      return done('Unauthorized', false);
    }
    done(null, payload);
  }
}
