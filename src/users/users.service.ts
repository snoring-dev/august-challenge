import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { users } from 'src/db/schema';

@Injectable()
export class UserService {
  constructor(
    @Inject('DATABASE') private db: any,
    private readonly mailerService: MailerService,
  ) {}

  private generateVerificationCode(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  async registerUser(email: string, phoneNumber: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = this.generateVerificationCode();

    try {
      const [user] = await this.db
        .insert(users)
        .values({
          email,
          phoneNumber,
          hashedPassword,
          verificationToken: verificationCode,
        })
        .returning();

      await this.sendVerificationEmail(email, verificationCode);

      return { id: user.id, email: user.email, phoneNumber: user.phoneNumber };
    } catch (error) {
      // Unique constraint violation
      if (error.code === '23505') {
        throw new ConflictException('Email or phone number already exists');
      }
      throw error;
    }
  }

  async sendVerificationEmail(email: string, code: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });
  }

  async resendVerificationCode(email: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailConfirmation) {
      throw new BadRequestException('Email already verified');
    }

    const newVerificationCode = this.generateVerificationCode();

    await this.db
      .update(users)
      .set({ verificationToken: newVerificationCode })
      .where(eq(users.id, user.id));

    await this.sendVerificationEmail(email, newVerificationCode);

    return { message: 'New verification code sent' };
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailConfirmation) {
      throw new BadRequestException('Email already verified');
    }

    if (user.verificationToken !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.db
      .update(users)
      .set({ emailConfirmation: true, verificationToken: null })
      .where(eq(users.id, user.id));

    return { message: 'Email verified successfully' };
  }

  async getUserByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async updateUserInfo(
    userId: number,
    updateData: Partial<{
      firstName: string;
      lastName: string;
      phoneNumber: string;
    }>,
  ) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    return updatedUser[0];
  }
}
