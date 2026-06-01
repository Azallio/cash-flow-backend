import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/middlewares/guards/jwt-auth.guard';
import { RequestWithUser } from './DTO/request/request-with-user.request';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Get current authenticated user',
    description: 'Returns the user data from the JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'User information object',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT token',
  })
  @Get('me')
  getMe(@Req() req: RequestWithUser) {
    return req.user;
  }

  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all registered users',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users returned successfully',
  })
  @Get()
  public async getAllUsers() {
    return this.userService.findAll();
  }

  @ApiOperation({
    summary: 'Delete user by ID',
    description: 'Permanently deletes a user from the system',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'User with given ID not found',
  })
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async deleteUser(@Param('id') id: number) {
    await this.userService.deleteUser(id);
  }
}
