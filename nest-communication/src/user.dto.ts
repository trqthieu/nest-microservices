export enum ERole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class User {
  id: number;

  username: string;

  fullName: string;

  description: string;

  email: string;

  avatar: string;

  role: ERole;

  password: string;

  createdAt: Date;

  updatedAt: Date;
}
