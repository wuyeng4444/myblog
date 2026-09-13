import { COOKIE, SESSION_SECONDS, configured, isAdmin, json, passwordMatches, sameOrigin, seal } from '../../../../lib/file-auth';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  return json({ authenticated: isAdmin(request), configured: configured() });
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: '请求来源无效' }, 403);
  if (!configured()) return json({ error: '管理员登录尚未配置' }, 503);
  const text = await request.text();
  if (text.length > 1024) return json({ error: '请求过大' }, 413);
  let password: unknown;
  try { password = JSON.parse(text).password; } catch { return json({ error: '请求格式错误' }, 400); }
  if (!passwordMatches(password)) return json({ error: '管理员密码不正确' }, 401);
  const token = seal({ purpose: 'admin', exp: Date.now() + SESSION_SECONDS * 1000 });
  const response = json({ authenticated: true });
  response.headers.set('Set-Cookie', `${COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
  return response;
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return json({ error: '请求来源无效' }, 403);
  const response = json({ authenticated: false });
  response.headers.set('Set-Cookie', `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
  return response;
}
