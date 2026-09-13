import { get, head, put, BlobNotFoundError, BlobPreconditionFailedError } from '@vercel/blob';
import { isAdmin, sameOrigin, json } from '../../../lib/file-auth';
import { validateHome, defaultHome } from '../../../lib/home-content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const path = 'site-content/home.json';
async function readCatalog() {
  try {
    const metadata = await head(path);
    const result = await get(path, { access: 'private', useCache: false });
    if (!result) return { content: defaultHome, revision: null };
    if (result.statusCode !== 200) throw new Error('读取失败');
    return { content: validateHome((await new Response(result.stream).json()).content), revision: metadata.etag };
  } catch (error) {
    if (error instanceof BlobNotFoundError) return { content: defaultHome, revision: null };
    throw error;
  }
}
export async function GET() {
  try { return json(await readCatalog()); }
  catch { return json({ error: '首页介绍暂时无法加载，请稍后重试' }, 503); }
}
export async function PUT(request: Request) {
  if (!isAdmin(request)) return json({ error: '请先登录管理员' }, 401);
  if (!sameOrigin(request)) return json({ error: '请求来源无效' }, 403);
  const text = await request.text();
  if (text.length > 20000) return json({ error: '内容过大' }, 413);
  let content, revision;
  try {
    const data = JSON.parse(text); content = validateHome(data.content); revision = data.revision;
    if (revision !== null && typeof revision !== 'string') throw new Error('版本信息错误');
  } catch (error) { return json({ error: error instanceof Error ? error.message : '内容格式错误' }, 400); }
  try {
    const current = await readCatalog();
    if (current.revision !== revision) return json({ error: '首页介绍已在其他窗口更新，请重新加载后再编辑' }, 409);
    const saved = await put(path, JSON.stringify({ content }), { access: 'private', addRandomSuffix: false, allowOverwrite: revision !== null, ...(revision ? { ifMatch: revision } : {}), contentType: 'application/json', cacheControlMaxAge: 60 });
    return json({ content, revision: saved.etag });
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError) return json({ error: '首页介绍已更新，请重新加载后再编辑' }, 409);
    return json({ error: '保存失败，编辑内容仍保留，请稍后重试' }, 503);
  }
}


