'use server';

import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { generateVerificationToken } from '@/lib/tokens';
import { RegisterSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const { email, password, name } = values;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already in use!' };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  // TODO: Send verification token email

  return { success: 'Confirmation email sent!' };
};
