import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateManyGamesDto } from './dto/create-many-games.dto';
import { Game } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import AuthUser from 'src/auth/auth-user.decorator';

@Controller('game')
export class GameController {
  constructor(private service: GameService) {}

  @Post('createMany')
  createMany(@Body() data: CreateManyGamesDto) {
    this.service.createMany(data);
  }

  @Get('findMany')
  findMany(): Promise<Game[]> {
    return this.service.findMany();
  }

  @Get('find/:id')
  findUnique(@Param('id') id: string): Promise<Game> {
    return this.service.findUnique(id);
  }

  @Get('wish/:id')
  @UseGuards(AuthGuard())
  likeMovie(
    @AuthUser() user: User,
    @Param('id') gameId: string,
  ): Promise<User> {
    const userId = user.id;
    return this.service.wishGame(userId, gameId);
  }

  @Get('myWishList')
  @UseGuards(AuthGuard())
  myWishList(@AuthUser() user: User): Promise<User> {
    const userId = user.id;
    return this.service.myWishList(userId);
  }
}
