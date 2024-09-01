import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import { getUserByEmail } from './data/user';
import { LoginSchema } from './schemas';

export default {
  providers: [
    credentials({
      async authorize(credentials, request) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password /* using OAuth */) return null;

          // hash만 비교할 뿐 실제 값은 몰라도 됨
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
