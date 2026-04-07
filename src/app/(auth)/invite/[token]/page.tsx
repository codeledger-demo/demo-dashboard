import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyInviteToken } from '@/lib/auth/jwt';
import { setInviteCookie } from '@/lib/auth/invite';

interface InvitePageProps {
  params: { token: string };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = params;

  try {
    await verifyInviteToken(token);
  } catch {
    redirect('/?error=invalid_token');
  }

  const cookieConfig = setInviteCookie(token);
  const cookieStore = cookies();
  cookieStore.set(cookieConfig.name, cookieConfig.value, cookieConfig.options);

  redirect('/team-health');
}
