import { User } from '@prisma/client';

export class LoginDto {
  email: string;
  password: string;
}

export class AuthResponse {
  token: string;
  user: User;
}
