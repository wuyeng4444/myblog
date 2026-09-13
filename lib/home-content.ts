export const defaultHome = {
  eyebrow: '无影的个人网站 · 写作 / 创作 / 日常',
  greeting: '你好，我是', name: '无影。',
  lead: '写一个不存在的世界，\n也记录真实生活里的片刻。',
  introduction: '我在写《帝国示录：我们是始嗣》，也喜欢折腾代码和网页。这里放我的作品、想法，还有那些暂时没想好放在哪里的文字。',
  caption: '✦ 世界还在写，故事慢慢来。',
};
export type HomeContent = typeof defaultHome;
export function validateHome(value: unknown): HomeContent {
  if (!value || typeof value !== 'object') throw new Error('首页内容格式错误');
  const result = {} as HomeContent;
  for (const key of Object.keys(defaultHome) as (keyof HomeContent)[]) {
    const text = (value as Record<string, unknown>)[key];
    if (typeof text !== 'string' || text.length > (key === 'introduction' ? 2000 : 300) || !text.trim()) throw new Error('请填写完整的首页介绍，内容不能过长');
    result[key] = text.trim();
  }
  return result;
}
