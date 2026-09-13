import { del, list } from '@vercel/blob';
import { isAdmin, json, sameOrigin, validPath } from '../../../../lib/file-auth';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  if (!isAdmin(request)) return json({ error: '请先登录管理员账户' }, 401);
  try {
    const cursor = new URL(request.url).searchParams.get('cursor') || undefined;
    if (cursor && cursor.length > 2000) return json({ error: '无效分页' }, 400);
    const result = await list({ prefix: 'files/', limit: 50, cursor });
    return json({ files: result.blobs.map(blob => ({ pathname: blob.pathname, size: blob.size, uploadedAt: blob.uploadedAt })), cursor: result.hasMore ? result.cursor : null });
  } catch { return json({ error: '文件列表暂时无法读取，请稍后重试' }, 503); }
}
export async function DELETE(request: Request) {
  if (!isAdmin(request)) return json({ error: '请先登录管理员账户' }, 401);
  if (!sameOrigin(request)) return json({ error: '请求来源无效' }, 403);
  try {
    const { pathname } = await request.json();
    if (!validPath(pathname)) return json({ error: '文件路径无效' }, 400);
    await del(pathname);
    return json({ deleted: true });
  } catch { return json({ error: '删除失败，请刷新后重试' }, 503); }
}
