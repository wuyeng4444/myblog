import { head } from '@vercel/blob';
import { isAdmin, json, sameOrigin, seal, validPath } from '../../../../lib/file-auth';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!isAdmin(request)) return json({ error: '请先登录管理员账户' }, 401);
  if (!sameOrigin(request)) return json({ error: '请求来源无效' }, 403);
  try {
    const { pathname, days = 7 } = await request.json();
    if (!validPath(pathname) || ![1, 7, 30].includes(days)) return json({ error: '分享参数无效' }, 400);
    await head(pathname);
    const exp = Date.now() + days * 86400000;
    const token = seal({ purpose: 'download', pathname, exp });
    return json({ url: `${new URL(request.url).origin}/d/${token}`, expiresAt: new Date(exp).toISOString() });
  } catch { return json({ error: '无法生成下载链接，请确认文件已上传完成' }, 400); }
}
