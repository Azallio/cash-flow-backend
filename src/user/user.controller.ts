import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Scope,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './DTO/request/createUser.request';
import { UpdateUserNameRequest } from './DTO/request/updateUserName.request';

@Controller({ scope: Scope.REQUEST, path: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async createUser(@Body() dto: CreateUserRequest) {
    await this.userService.createUser(dto.name);
  }

  @Put(':id')
  public async updateUserName(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserNameRequest,
  ) {
    await this.userService.updateUserName(id, dto.name);
  }
}
