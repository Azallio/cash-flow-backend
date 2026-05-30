import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Scope,
} from '@nestjs/common';
import { CreateUserRequest } from './DTO/request/createUser.request';
import { UpdateUserNameRequest } from './DTO/request/updateUserName.request';
import { UserService } from './user.service';

@Controller({ scope: Scope.REQUEST, path: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async createUser(@Body() dto: CreateUserRequest) {
    await this.userService.createUser(dto.email, dto.passwordHash);
  }

  @Put(':id')
  public async updateUserEmail(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserNameRequest,
  ) {
    await this.userService.updateUserEmail(id, dto.email);
  }
}
