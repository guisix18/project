import { Request } from 'express';
import { IUser } from 'src/user/entities/user.interface';

export interface AuthRequest extends Request {
  user: IUser;
}
