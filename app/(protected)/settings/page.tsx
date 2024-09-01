import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';

export default async function Page() {
  const session = await auth();
  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          'use server';
          await signOut();
          revalidatePath('/settings')
          revalidatePath('/auth/login')
        }}
      >
        <Button type="submit">Sign out</Button>
      </form>
    </div>
  );
}
