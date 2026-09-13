import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const COOKIE = 'wuyeng_file_admin';
export const SESSION_SECONDS = 8 * 60 * 60;
export const MAX_FILE_SIZE = 500 * 1024 * 1024;
export function configured() { return Boolean(process.env.FILE_ADMIN_PASSWORD_HASH && process.env.FILE_ADMIN_SECRET); }
function signature(payload: string) {
  if (!process.env.FILE_ADMIN_SECRET) throw new Error('管理员尚未配置');
  return createHmac('sha256', process.env.FILE_ADMIN_SECRET).update(payload).digest('base64url');
}
export function seal(data: Record<string, unknown>) {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  return `${payload}.${signature(payload)}`;
}
export function unseal(token: string, purpose: string): Record<string, unknown> | null {
  if (!configured() || token.length > 4096) return null;
  try {
    const [payload, mac, extra] = token.split('.');
    if (!payload || !mac || extra) return null;
    const expected = Buffer.from(signature(payload));
    const actual = Buffer.from(mac);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.purpose === purpose && typeof data.exp === 'number' && data.exp > Date.now() ? data : null;
  } catch { return null; }
}
export function passwordMatches(password: unknown) {
  if (!configured() || typeof password !== 'string' || password.length > 256) return false;
  const actual = createHash('sha256').update(password).digest('hex');
  const expected = process.env.FILE_ADMIN_PASSWORD_HASH!;
  return actual.length === expected.length && timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}
export function isAdmin(request: Request) {
  const cookie = request.headers.get('cookie')?.split(';').map(v => v.trim()).find(v => v.startsWith(`${COOKIE}=`));
  return Boolean(cookie && unseal(cookie.slice(COOKIE.length + 1), 'admin'));
}
export function sameOrigin(request: Request) {
  return request.headers.get('origin') === new URL(request.url).origin;
}
export function validPath(pathname: unknown): pathname is string {
  return typeof pathname === 'string' && /^files\/[0-9a-f-]{36}\/[\p{L}\p{N}_. ()-]{1,180}$/u.test(pathname) && !pathname.includes('..');
}
export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
}
