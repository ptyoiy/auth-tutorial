'use server';

import { signIn } from '@/auth';
import { getUserByEmail } from '@/data/user';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';
import { AuthError } from 'next-auth';
import { z } from 'zod';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const existingUser = await getUserByEmail(values.email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist!' };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { success: 'Confirmation email resent!' };
  }

  try {
    await signIn('credentials', {
      ...values,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return { success: 'Successfully logged in!' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          return { error: 'Invalid credentials!' };
        }
        default: {
          return { error: 'Something went wrong!' };
        }
      }
    }

    throw error; // AuthError가 아닐 경우 다른 try catch로 보내주기 위함
  }
};
