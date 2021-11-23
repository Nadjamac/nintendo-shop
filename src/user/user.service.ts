import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private database: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const emailExist = await this.database.user.findUnique({
      where: { email: data.email },
    });

    if (emailExist) {
      throw new ConflictException('Email já cadastrado');
    }

    const nicknameExist = await this.database.user.findUnique({
      where: { nickname: data.nickname },
    });

    if (nicknameExist) {
      throw new ConflictException('Nickname já cadastrado');
    }

    if (data.password !== data.passwordConfirmation) {
      throw new UnprocessableEntityException('Senhas não conferem');
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await this.database.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    delete user.password;
    return user;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.database.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    delete user.password;
    return user;
  }
}
