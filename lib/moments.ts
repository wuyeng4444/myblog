export type Moment = { id: string; date: string; content: string; location: string; images: string[] };
export function validateMoments(value: unknown): Moment[] {
  if (!Array.isArray(value) || value.length > 1000) throw new Error('最多保存 1000 条说说');
  const ids = new Set<string>();
  return value.map(item => {
    if (!item || typeof item !== 'object') throw new Error('说说格式错误');
    const read = (key: string, max: number) => {
      if (typeof item[key] !== 'string' || item[key].length > max) throw new Error('说说字段过长或格式错误');
      return item[key].trim();
    };
    const moment = { id: read('id', 100), date: read('date', 40), content: read('content', 10000), location: read('location', 150), images: item.images };
    if (!moment.id || ids.has(moment.id) || !moment.content || !Number.isFinite(Date.parse(moment.date))) throw new Error('请填写说说内容和有效日期');
    if (!Array.isArray(moment.images) || moment.images.length > 9 || moment.images.some((image: unknown) => {
      if (typeof image !== 'string' || image.length > 2048) return true;
      if (/^\/[a-zA-Z0-9_/-]+\.[a-zA-Z0-9]+$/.test(image)) return false;
      try { const url = new URL(image); return url.protocol !== 'https:' || Boolean(url.username || url.password); } catch { return true; }
    })) throw new Error('最多添加 9 张图片，请使用 https 图片链接或本站图片路径');
    ids.add(moment.id);
    return moment;
  });
}
