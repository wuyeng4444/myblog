import { getDownloadUrl, head, issueSignedToken, presignUrl } from '@vercel/blob';
import { unseal, validPath } from '../../../lib/file-auth';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const data = unseal(token, 'download');
  const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'Referrer-Policy': 'no-referrer' };
  if (!data || !validPath(data.pathname)) return new Response('下载链接无效或已过期，请联系文件提供者获取新链接。', { status: 404, headers });
  try {
    await head(data.pathname);
    const validUntil = Math.min(Number(data.exp), Date.now() + 5 * 60 * 1000);
    const signed = await issueSignedToken({ pathname: data.pathname, operations: ['get'], validUntil });
    const { presignedUrl } = await presignUrl(signed, { pathname: data.pathname, operation: 'get', access: 'private', validUntil });
    return new Response(null, { status: 302, headers: { ...headers, Location: getDownloadUrl(presignedUrl) } });
  } catch { return new Response('文件暂时无法下载，请稍后再试或联系文件提供者。', { status: 503, headers }); }
}
