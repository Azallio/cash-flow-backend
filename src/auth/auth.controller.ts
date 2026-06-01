import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Scope,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequest } from './DTO/request/login.request';
import { RegisterRequest } from './DTO/request/register.request';
import { LoginResponse } from './DTO/response/login.response';

@ApiTags('Auth')
@Controller({ scope: Scope.REQUEST, path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({ type: LoginResponse, description: 'JWT tokens returned' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  public async login(@Body() dto: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ type: LoginResponse, description: 'JWT tokens returned' })
  @ApiCreatedResponse({
    type: LoginResponse,
    description: 'User registered, JWT tokens returned',
  })
  @ApiConflictResponse({ description: 'User with this email already exists' })
  public async register(@Body() dto: RegisterRequest): Promise<LoginResponse> {
    return this.authService.register(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT tokens' })
  @ApiOkResponse({
    type: LoginResponse,
    description: 'New JWT tokens returned',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  public async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<LoginResponse> {
    return this.authService.refreshToken(refreshToken);
  }
}
