export interface UserPayload {
  sub: string | number | any; // Vou arranjar uma solução para esse problema depois. TypeScript ta enchendo o saco.
  email: string;
  name: string;
  isActive: boolean;
  task?: {};
  iat?: number;
  exp?: number;
}
