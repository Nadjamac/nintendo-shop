import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Game, User } from '@prisma/client';
import { CreateManyGamesDto } from './dto/create-many-games.dto';

@Injectable()
export class GameService {
  constructor(private database: PrismaService) {}

  async create(data: CreateGameDto): Promise<Game> {
    const game = await this.database.game.create({
      data,
    });
    return game;
  }

  async createMany(data: CreateManyGamesDto): Promise<any[]> {
    const createdGames = [];

    data.games.map(async (game) => {
      const gameExist = await this.findPerName(game.name);

      if (!gameExist) {
        createdGames.push(this.create(game));
      }
    });

    return createdGames;
  }

  async findMany(): Promise<Game[]> {
    const games = await this.database.game.findMany();
    return games;
  }

  async findUnique(id: string): Promise<Game> {
    const game = await this.database.game.findUnique({
      where: { id },
    });

    if (!game) {
      throw new NotFoundException('ID Não encontrado');
    }

    return game;
  }

  async findPerName(name: string): Promise<Game> {
    const game = await this.database.game.findFirst({
      where: { name: name },
    });

    return game;
  }

  async wishGame(userId: string, gameId: string): Promise<User> {
    await this.database.user.update({
      where: { id: userId },
      data: {
        games: {
          connect: {
            id: gameId,
          },
        },
      },
    });

    return this.database.user.findUnique({
      where: { id: userId },
      include: {
        games: true,
      },
    });
  }

  async myWishList(userId: string): Promise<User> {
    return this.database.user.findUnique({
      where: { id: userId },
      include: {
        games: true,
      },
    });
  }
}
