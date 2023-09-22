import { Request } from 'express';
import { UserDTO } from 'src/user/dto/user.dto';

export interface AuthRequest extends Request {
  user: UserDTO;
}
