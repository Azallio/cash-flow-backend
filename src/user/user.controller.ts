import {
  Controller,
  Delete,
  Get,
  Param,
  Req,
  Scope,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/middlewares/guards/jwt-auth.guard';
import { RequestWithUser } from './DTO/request/request-with-user.request';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller({ scope: Scope.REQUEST, path: 'users' })
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiResponse({
    status: 200,
    description: 'User information object',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @Get('me')
  getMe(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of all users',
  })
  public async getAllUsers() {
    return this.userService.findAll();
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiOperation({ summary: 'Delete a user by ID' })
  public async deleteUser(@Param('id') id: number) {
    await this.userService.deleteUser(id);
  }
}
