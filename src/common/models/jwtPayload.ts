import { Expose } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty } from 'class-validator';

export class JwtPayload {
  @IsNotEmpty()
  @IsInt()
  @Expose()
  public userId: number;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  public email: string;

  constructor(userId: number, email: string) {
    this.userId = userId;
    this.email = email;
  }
}
