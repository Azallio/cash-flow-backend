import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { JwtPayload } from '../common/models/jwtPayload';
import { RefreshTokenEntity } from '../DAL/entities/refresh-token.entity';
import { UserService } from '../user/user.service';
import { LoginRequest } from './DTO/request/login.request';
import { LoginResponse } from './DTO/response/login.response';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: EntityRepository<RefreshTokenEntity>,

    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(dto: LoginRequest): Promise<LoginResponse> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.checkPassword(dto.password, user.passwordHash);

    return await this.jwtService.generateTokens({
      userId: user.id,
      email: user.email,
    });
  }

  public async register(dto: LoginRequest): Promise<LoginResponse> {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const newUser = await this.userService.createUser(dto.email, passwordHash);

    return await this.jwtService.generateTokens({
      userId: newUser.id,
      email: newUser.email,
    });
  }

  public async refreshToken(
    requestRefreshToken: string,
  ): Promise<LoginResponse> {
    const now = new Date();

    const [refreshTokenId, token] = requestRefreshToken.split('-');

    const payload: JwtPayload = this.jwtService.verify(token);

    const user = await this.userService.getUserById(payload.userId);

    const refreshTokenEntity = await this.refreshTokenRepository.findOne({
      id: +refreshTokenId,
      expiresAt: { $gt: now },
    });

    if (!refreshTokenEntity) {
      throw new UnauthorizedException('Refresh token not found or expired');
    }

    if (!user || refreshTokenEntity.user.id !== user.id) {
      throw new UnauthorizedException();
    }

    const tokenHash = createHash('sha256').update(token).digest('hex');

    if (tokenHash !== refreshTokenEntity.tokenHash) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.refreshTokenRepository
      .getEntityManager()
      .remove(refreshTokenEntity)
      .flush();

    const tokens = await this.jwtService.generateTokens({
      email: user.email,
      userId: user.id,
    });

    return new LoginResponse(tokens.accessToken, tokens.refreshToken);
  }

  private async checkPassword(password: string, passwordHash: string) {
    const isCorrectPassword = await bcrypt.compare(password, passwordHash);

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }
  }
}
