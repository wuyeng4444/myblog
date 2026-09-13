import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { MAX_FILE_SIZE, isAdmin, json, sameOrigin, validPath } from '../../../../lib/file-auth';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  // No completion callback is needed: the store itself is the administrator's file index.
  if (!isAdmin(request)) return json({ error: '请先登录管理员账户' }, 401);
  if (!sameOrigin(request)) return json({ error: '请求来源无效' }, 403);
  try {
    const body = await request.json() as HandleUploadBody;
    if (body.type !== 'blob.generate-client-token') return json({ error: '无效上传请求' }, 400);
    return json(await handleUpload({ request, body, onBeforeGenerateToken: async pathname => {
      if (!validPath(pathname)) throw new Error('文件名无效');
      return { maximumSizeInBytes: MAX_FILE_SIZE, addRandomSuffix: false, allowOverwrite: false, validUntil: Date.now() + 60 * 60 * 1000 };
    } }));
  } catch { return json({ error: '无法准备上传，请确认文件名与存储配置' }, 400); }
}
