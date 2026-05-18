import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { SessionService } from '../../../database/mongoose/dao/session.dao';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          // Fallback to Authorization header if available
          return req.headers.authorization?.split(' ')[1] || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    // Extract token from request (from Authorization header)
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    // Validate session exists and is active
    const session = await this.sessionService.validateSessionToken(token);

    if (!session) {
      throw new UnauthorizedException('Session expired or revoked');
    }

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role || 'user',
    };
  }
}
