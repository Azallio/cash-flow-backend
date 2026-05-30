import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class JwtPayload {
  @IsNotEmpty()
  @IsInt()
  @Expose()
  public userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }
}
