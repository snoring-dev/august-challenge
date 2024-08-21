import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyResetCodeDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
