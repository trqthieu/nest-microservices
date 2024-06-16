import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  ParseIntPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './CreateUser.dto';
import { AuthGuard } from './guard/auth/auth.guard';
import { ValidateCreateUserPipe } from './pipe/validate-create-user/validate-create-user.pipe';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @Get()
  // getUsers() {
  //   return this.usersService.getUsers();
  // }
  @Post(':id')
  updateUser(@Body() userData: UpdateUserDto, @Param('id') id: string) {
    return this.usersService.updateUser(+id, userData);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
  // @Get(':id')
  // getUserById(@Param('id', ParseIntPipe) id) {
  //   return this.usersService.getUserById(id);
  // }
}
