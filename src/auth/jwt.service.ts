import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { JwtPayload } from '../common/models/jwtPayload';
import { ConfigService } from '../configuration/config.service';
import { RefreshTokenEntity } from '../DAL/entities/refresh-token.entity';
import { UserEntity } from '../DAL/entities/user.entity';

@Injectable()
export class JwtService extends NestJwtService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: EntityRepository<RefreshTokenEntity>,
    private readonly _configService: ConfigService,
  ) {
    super({
      secret: _configService.jwtModuleConfig.secret,
      signOptions: _configService.jwtModuleConfig.signOptions,
    });
  }
  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.signAsync({ ...payload });
  }

  // private async generateSecretToken() {
  //   return randomBytes(48).toString('base64url');
  // }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    const person = await this.refreshTokenRepository
      .getEntityManager()
      .findOneOrFail(UserEntity, payload.userId);

    const secretToken = await this.generateAccessToken({
      ...payload,
    });

    const secretTokenHash = createHash('sha256')
      .update(secretToken)
      .digest('hex');

    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    const refreshToken = new RefreshTokenEntity(
      person,
      secretTokenHash,
      expires,
    );

    await this.refreshTokenRepository
      .getEntityManager()
      .persist(refreshToken)
      .flush();

    return refreshToken.id + '-' + secretToken;
  }

  public async generateTokens(
    payload: JwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
