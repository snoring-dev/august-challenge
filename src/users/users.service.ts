import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { users } from 'src/db/schema';

@Injectable()
export class UserService {
  constructor(@Inject('DATABASE') private db: any) {}

  async registerUser(email: string, phoneNumber: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    try {
      const [user] = await this.db
        .insert(users)
        .values({
          email,
          phoneNumber,
          hashedPassword,
          verificationToken,
        })
        .returning();

      return { id: user.id, email: user.email, phoneNumber: user.phoneNumber };
    } catch (error) {
      // Unique constraint violation
      if (error.code === '23505') {
        throw new ConflictException('Email or phone number already exists');
      }
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }
}
