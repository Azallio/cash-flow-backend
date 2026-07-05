import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { EnvPropertyNotFoundError } from '../common/errors/envPropertyNotFound.error';
import { FormatError } from '../common/errors/format.error';

@Injectable()
export class ConfigService {
  private readonly _configuration: NestConfigService;

  constructor(private configuration: NestConfigService) {
    this._configuration = configuration;
  }

  get appPort(): number {
    return this.readInt('APP_PORT');
  }

  // JWT
  get jwtModuleConfig(): JwtModuleOptions {
    return {
      global: true,
      secret: this.readString('JWT_SECRET'),
      signOptions: {
        expiresIn: this.readString('JWT_ACCESS_LIFETIME') as StringValue,
      },
    };
  }

  // Admin credentials
  get adminEmail(): string {
    return this.readString('ADMIN_EMAIL');
  }

  get adminPassword(): string {
    return this.readString('ADMIN_PASSWORD');
  }

  // Helpers
  private readString(propertyName: string): string {
    const value = this._configuration.get<string>(propertyName);
    if (value == null) {
      throw new EnvPropertyNotFoundError(propertyName);
    }
    return value;
  }

  private readInt(propertyName: string): number {
    const value = this._configuration.get<string>(propertyName);
    if (value == null) {
      throw new EnvPropertyNotFoundError(propertyName);
    }
    return parseInt(value);
  }

  private readFloat(propertyName: string): number {
    const value = this._configuration.get<string>(propertyName);
    if (value == null) {
      throw new EnvPropertyNotFoundError(propertyName);
    }
    return parseFloat(value);
  }

  private readEnum<T>(propertyName: string, enumType: Record<string, T>): T {
    const value = this._configuration.get<string>(propertyName);

    if (!value) {
      throw new EnvPropertyNotFoundError(propertyName);
    }

    const enumValue = enumType[value as keyof typeof enumType];

    if (enumValue == null) {
      throw new Error(
        `Invalid enum value "${value}" for property "${propertyName}"`,
      );
    }

    return enumValue;
  }

  private readBool(propertyName: string): boolean {
    const value = this._configuration.get<string>(propertyName)?.toLowerCase();

    if (value == null) {
      throw new EnvPropertyNotFoundError(propertyName);
    }

    switch (value) {
      case 'true':
        return true;
      case 'false':
        return false;

      default:
        throw new FormatError(value, Boolean);
    }
  }
}
