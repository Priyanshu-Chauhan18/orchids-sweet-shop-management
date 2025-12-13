export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  username: string;
  password_hash: string;
  role: UserRole;
}
