import { jwtVerify, SignJWT } from 'jose';

export interface InviteTokenPayload {
  sub: string;
  email: string;
  scope: string;
  iat: number;
  exp: number;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.DASHBOARD_JWT_SECRET;
  if (!secret) {
    throw new Error(
      'DASHBOARD_JWT_SECRET is not set. Add it to your environment variables.'
    );
  }
  return new TextEncoder().encode(secret);
}

export async function verifyInviteToken(
  token: string
): Promise<InviteTokenPayload> {
  const secret = getJwtSecret();
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ['HS256'],
  });

  if (
    typeof payload.sub !== 'string' ||
    typeof payload.email !== 'string' ||
    typeof payload.scope !== 'string'
  ) {
    throw new Error('Invalid invite token payload');
  }

  return {
    sub: payload.sub,
    email: payload.email as string,
    scope: payload.scope as string,
    iat: payload.iat ?? 0,
    exp: payload.exp ?? 0,
  };
}

export async function createInviteToken(params: {
  sub: string;
  email: string;
  scope: string;
  expiresIn?: string;
}): Promise<string> {
  const secret = getJwtSecret();
  const jwt = await new SignJWT({
    sub: params.sub,
    email: params.email,
    scope: params.scope,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(params.expiresIn ?? '7d')
    .sign(secret);

  return jwt;
}
