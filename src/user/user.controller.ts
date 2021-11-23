import {
  Body,
  Controller,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Post('register')
  create(@Body() data: CreateUserDto): Promise<User> {
    if (data.password !== data.passwordConfirmation) {
      throw new UnprocessableEntityException('Senhas não conferem');
    }

    delete data.passwordConfirmation;
    return this.service.create(data);
  }
}
