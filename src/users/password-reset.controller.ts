import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyResetCodeDto } from './dto/verify-reset-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('password-reset')
export class PasswordResetController {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('request')
  async requestReset(@Body('email') email: string) {
    const resetCode = await this.userService.generateResetCode(email);

    await this.mailerService.sendMail({
      to: email,
      subject: 'DailyFrench | Reset password',
      text: `Your reset code is: ${resetCode}`,
      html: `<p>Your reset code is: <strong>${resetCode}</strong></p>`,
    });

    return { message: 'Password reset code sent' };
  }

  @Post('verify')
  async verifyResetCode(@Body() verifyData: VerifyResetCodeDto) {
    const isValid = await this.userService.verifyResetCode(
      verifyData.email,
      verifyData.code,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    return { success: true };
  }

  @Post('reset')
  async resetPassword(
    @Body()
    resetData: ResetPasswordDto,
  ) {
    if (resetData.newPassword !== resetData.newPasswordConfirmation) {
      throw new BadRequestException('Passwords do not match');
    }

    await this.userService.resetPassword(
      resetData.email,
      resetData.newPassword,
    );

    return { message: 'Password reset successful' };
  }
}
