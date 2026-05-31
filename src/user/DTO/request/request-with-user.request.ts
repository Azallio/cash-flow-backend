import { Request } from 'express';
import { JwtPayload } from '../../../common/models/jwtPayload';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
