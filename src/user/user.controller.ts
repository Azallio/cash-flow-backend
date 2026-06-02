import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ApiOkResponseWrapped,
  ApiOkResponseWrappedNoData,
  ApiOkResponseWrappedPagingArray,
} from '../common/DTO/apiResponse';
import { PagingQueryRequest } from '../common/DTO/pagingQueryRequest';
import { JwtAuthGuard } from '../common/middlewares/guards/jwt-auth.guard';
import { RequestWithUser } from './DTO/request/request-with-user.request';
import { UserResponse } from './DTO/response/user.response';
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
  @ApiOkResponseWrapped(UserResponse, {
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
  @ApiOkResponseWrappedPagingArray(
    UserResponse,
    'List of users returned successfully',
  )
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
  @Get()
  public async getAllUsers(@Query() paging: PagingQueryRequest) {
    return this.userService.findAll(paging);
  }

  @ApiOperation({
    summary: 'Delete user by ID',
    description: 'Permanently deletes a user from the system',
  })
  @ApiOkResponseWrappedNoData('User deleted successfully')
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
