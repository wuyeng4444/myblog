export type Work = { id: string; title: string; description: string; url: string; code: string };
export function validateWorks(value: unknown): Work[] {
  if (!Array.isArray(value) || value.length > 100) throw new Error('最多发布 100 个作品');
  const ids = new Set<string>();
  return value.map(item => {
    if (!item || typeof item !== 'object') throw new Error('作品格式错误');
    const read = (key: string, max: number) => {
      if (typeof item[key] !== 'string' || item[key].length > max) throw new Error('作品字段过长或格式错误');
      return item[key].trim();
    };
    const work = { id: read('id', 64), title: read('title', 100), description: read('description', 2000), url: read('url', 2048), code: read('code', 100) };
    if (!work.id || ids.has(work.id) || !work.title) throw new Error('请填写作品名称，作品编号不能重复');
    let url: URL;
    try { url = new URL(work.url); } catch { throw new Error('请填写完整的网盘链接'); }
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('链接必须以 https:// 或 http:// 开头');
    ids.add(work.id);
    return work;
  });
}
