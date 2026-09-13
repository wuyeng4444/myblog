import { get, head, put, BlobNotFoundError, BlobPreconditionFailedError } from '@vercel/blob';
import { isAdmin, sameOrigin, json } from '../../../lib/file-auth';
import { validateWorks } from '../../../lib/works';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const path = 'site-content/works.json';
async function readCatalog() {
  try {
    const metadata = await head(path);
    const result = await get(path, { access: 'private', useCache: false });
    if (!result) return { works: [], revision: null };
    if (result.statusCode !== 200) throw new Error('读取失败');
    const data = await new Response(result.stream).json();
    return { works: validateWorks(data.works), revision: metadata.etag };
  } catch (error) {
    if (error instanceof BlobNotFoundError) return { works: [], revision: null };
    throw error;
  }
}
export async function GET() {
  try { return json(await readCatalog()); }
  catch { return json({ error: '作品暂时无法加载，请稍后重试' }, 503); }
}
export async function PUT(request: Request) {
  if (!isAdmin(request)) return json({ error: '请先登录管理员' }, 401);
  if (!sameOrigin(request)) return json({ error: '请求来源无效' }, 403);
  const text = await request.text();
  if (text.length > 300000) return json({ error: '内容过大' }, 413);
  let works, revision;
  try {
    const data = JSON.parse(text);
    works = validateWorks(data.works);
    revision = data.revision;
    if (revision !== null && typeof revision !== 'string') throw new Error('版本信息错误');
  } catch (error) { return json({ error: error instanceof Error ? error.message : '内容格式错误' }, 400); }
  try {
    const current = await readCatalog();
    if (current.revision !== revision) return json({ error: '作品已在其他窗口更新，请重新加载后编辑' }, 409);
    const saved = await put(path, JSON.stringify({ works }), {
      access: 'private', addRandomSuffix: false, allowOverwrite: revision !== null,
      ...(revision ? { ifMatch: revision } : {}), contentType: 'application/json', cacheControlMaxAge: 60,
    });
    return json({ works, revision: saved.etag });
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError) return json({ error: '作品已更新，请重新加载后编辑' }, 409);
    return json({ error: '保存失败，内容仍保留在编辑框中，请稍后重试' }, 503);
  }
}

