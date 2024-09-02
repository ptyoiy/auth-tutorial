'use server';

import { getUserByEmail } from '@/data/user';
import { getVerifactionTokenByToken } from '@/data/verificationToken';
import { db } from '@/lib/db';

export const newVerification = async (token: string) => {
  const existingToken = await getVerifactionTokenByToken(token);
  if (!existingToken) {
    return { error: 'Token does not exists!' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: 'Token has expired!' };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: 'Email does not exist!' };
  }

  // email까지 update하는 이유
  // register 단계에서는 괜찮은데
  // 사용자 프로필 업데이트 시(이메일 변경)에도 사용할 수 있게 만듦
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: 'Email verified!' };
};
