import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../../../configuration/config.service';
import { JwtPayload } from '../../../models/jwtPayload';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable({ scope: Scope.DEFAULT })
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(_configService: ConfigService) {
    if (_configService.jwtModuleConfig.secret == null) {
      throw new InternalServerErrorException('Service temporarily unavailable');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.jwtModuleConfig.secret,
    });
  }

  async validate(payload: any): Promise<JwtPayload> {
    if (typeof payload !== 'object' || payload == null) {
      throw new BadRequestException('Not a valid token');
    }

    return await this.convertToClassAndValidate(payload);
  }

  private async convertToClassAndValidate(
    payload: object,
  ): Promise<JwtPayload> {
    const jwtPayload = plainToInstance(JwtPayload, payload, {
      excludeExtraneousValues: true,
    });
    const tokenValidationErrors = await validate(jwtPayload, {
      forbidNonWhitelisted: true,
    });

    if (tokenValidationErrors.length > 0) {
      for (const error of tokenValidationErrors) {
        console.error(error);
      }

      throw new BadRequestException('Not a valid token');
    }

    return jwtPayload;
  }
}
