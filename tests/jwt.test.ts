import { describe, it, expect, beforeAll } from 'vitest';

beforeAll(() => {
  process.env.DASHBOARD_JWT_SECRET = 'test-secret-at-least-32-chars-long-ok';
});

describe('jwt', () => {
  it('createInviteToken returns a valid JWT string', async () => {
    const { createInviteToken } = await import('@/lib/auth/jwt');
    const token = await createInviteToken({
      sub: 'user-1',
      email: 'test@example.com',
      scope: 'invite',
    });
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });

  it('verifyInviteToken returns payload with correct email and scope', async () => {
    const { createInviteToken, verifyInviteToken } = await import('@/lib/auth/jwt');
    const token = await createInviteToken({
      sub: 'user-1',
      email: 'test@example.com',
      scope: 'invite',
    });
    const payload = await verifyInviteToken(token);
    expect(payload.email).toBe('test@example.com');
    expect(payload.scope).toBe('invite');
    expect(payload.sub).toBe('user-1');
  });

  it('verifyInviteToken throws on invalid token', async () => {
    const { verifyInviteToken } = await import('@/lib/auth/jwt');
    await expect(verifyInviteToken('invalid.token.here')).rejects.toThrow();
  });

  it('token with 7d expiry has exp ~7 days from now', async () => {
    const { createInviteToken, verifyInviteToken } = await import('@/lib/auth/jwt');
    const token = await createInviteToken({
      sub: 'u',
      email: 'a@b.com',
      scope: 'invite',
      expiresIn: '7d',
    });
    const payload = await verifyInviteToken(token);
    const nowSec = Math.floor(Date.now() / 1000);
    const sevenDays = 7 * 24 * 60 * 60;
    expect(Math.abs(payload.exp - (nowSec + sevenDays))).toBeLessThan(60);
  });

  it('token with 14d expiry has exp ~14 days from now', async () => {
    const { createInviteToken, verifyInviteToken } = await import('@/lib/auth/jwt');
    const token = await createInviteToken({
      sub: 'u',
      email: 'a@b.com',
      scope: 'invite',
      expiresIn: '14d',
    });
    const payload = await verifyInviteToken(token);
    const nowSec = Math.floor(Date.now() / 1000);
    const fourteenDays = 14 * 24 * 60 * 60;
    expect(Math.abs(payload.exp - (nowSec + fourteenDays))).toBeLessThan(60);
  });

  it('verifyInviteToken rejects expired tokens', async () => {
    const { createInviteToken, verifyInviteToken } = await import('@/lib/auth/jwt');
    const token = await createInviteToken({
      sub: 'u',
      email: 'a@b.com',
      scope: 'invite',
      expiresIn: '1s',
    });
    await new Promise((r) => setTimeout(r, 1500));
    await expect(verifyInviteToken(token)).rejects.toThrow();
  });
});
