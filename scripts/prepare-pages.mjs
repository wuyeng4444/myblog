// Create an isolated static build workspace; preserve the current server deployment.
import { cp, mkdir, readFile, writeFile, readdir, rm, lstat } from 'node:fs/promises';
import matter from 'gray-matter';
import path from 'node:path';
const root = process.cwd();
const destination = path.join(root, '.pages-build');
if (path.resolve(destination) !== path.resolve(root, '.pages-build')) throw new Error('Unsafe build path');
const previous = await lstat(destination).catch(error => { if (error.code === 'ENOENT') return null; throw error; });
if (previous?.isSymbolicLink()) throw new Error('Build directory must not be a link');
if (previous) await rm(destination, { recursive: true });
await mkdir(destination, { recursive: true });
const excluded = new Set(['app/api', 'app/admin', 'app/d']);
for (const entry of ['app', 'components', 'lib', 'data', 'posts', 'moments', 'content', 'public', 'siteConfig.ts', 'package.json', 'package-lock.json', 'tsconfig.json', 'postcss.config.mjs']) {
  await cp(path.join(root, entry), path.join(destination, entry), {
    recursive: true,
    filter: async source => {
      const relative = path.relative(root, source).split(path.sep).join('/');
      if (excluded.has(relative)) return false;
      if (relative.startsWith('posts/') && relative.endsWith('.md')) {
        const { data } = matter(await readFile(source, 'utf8'));
        if (data.draft === true) return false;
      }
      return true;
    },
  });
}
await writeFile(path.join(destination, 'next.config.ts'), `import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'export', trailingSlash: true, basePath: '/myblog',
  images: { unoptimized: true }, typescript: { ignoreBuildErrors: true },
};
export default config;
`);
await writeFile(path.join(destination, 'public', '.nojekyll'), '');
console.log('Static build workspace prepared at .pages-build');

// Content is bundled into the public site, so visitors never need a separate API.
for (const name of ['home-content', 'moments', 'works']) {
  const data = JSON.parse((await readFile(path.join(root, 'content', name + '.json'), 'utf8')).replace(/^\uFEFF/, ''));
  await writeFile(path.join(destination, 'content', name + '.json'), JSON.stringify(data, null, 2));
}
const homeSource = await readFile(path.join(root, 'components/HomeIntro.tsx'), 'utf8');
let hero = homeSource.slice(homeSource.indexOf('  return <><section'), homeSource.indexOf('  {manage &&'));
hero = hero.replace(/<div><button className="personal-secondary works-manage".*?<\/div>/s, '<div><Link className="personal-secondary works-manage" href="/admin/">管理网站 →</Link></div>');
await writeFile(path.join(destination, 'components/HomeIntro.tsx'), `import Link from 'next/link';
import { siteConfig } from '../siteConfig';
import snapshot from '../content/home-content.json';
export default function HomeIntro() { const content = snapshot.content;
${hero}</>; }
`);
await writeFile(path.join(destination, 'components/RecentMoments.tsx'), `import snapshot from '../content/moments.json';
export default function RecentMoments() {
const moments = [...snapshot.moments].sort((a,b) => Date.parse(b.date)-Date.parse(a.date)).slice(0,2);
return <div className="personal-notes">{moments.map(m => <article key={m.id}><time>{new Date(m.date).toLocaleDateString('zh-CN', {timeZone:'Asia/Shanghai'})}</time><p>{m.content.slice(0,180)}</p></article>)}{!moments.length && <p>有了新鲜事，就记在这里。</p>}</div>;
}`);
await writeFile(path.join(destination, 'app/moments/MomentsBoard.tsx'), `import Link from 'next/link';
import MomentList from './MomentList';
import snapshot from '../../content/moments.json';
import { siteConfig } from '../../siteConfig';
export default function MomentsBoard() { return <><div className="personal-subpage" style={{paddingBottom:0,paddingTop:28}}><Link href="/admin/" className="personal-secondary">管理说说 →</Link></div><MomentList moments={snapshot.moments} authorName={siteConfig.authorName} avatarUrl={siteConfig.avatarUrl} /></>; }
`);
await writeFile(path.join(destination, 'app/works/WorksBoard.tsx'), `import Link from 'next/link';
import snapshot from '../../content/works.json';
import type { Work } from '../../lib/works';
export default function WorksBoard() { const works: Work[] = snapshot.works; return <section className="works-downloads"><p className="personal-eyebrow">COLLECTION / 作品与下载</p><h2>作品与资料</h2>{!works.length && <p className="personal-subtitle">作品链接正在整理，稍后再来看看。</p>}{works.map(work => <article className="work-link-card" key={work.id}><h3>{work.title}</h3>{work.description && <p>{work.description}</p>}<div className="personal-actions"><a className="personal-primary" href={work.url} target="_blank" rel="noopener noreferrer">打开网盘 / 查看作品 ↗</a>{work.code && <span>提取码：<code>{work.code}</code></span>}</div></article>)}<Link className="personal-secondary works-manage" href="/admin/">管理作品 →</Link></section>; }
`);
await mkdir(path.join(destination, 'app/admin'), { recursive: true });
await cp(path.join(root, 'scripts/pages-admin.tsx'), path.join(destination, 'app/admin/page.tsx'));
await mkdir(path.join(destination, 'app/writing'), { recursive: true });
await cp(path.join(root, 'scripts/pages-writing.tsx'), path.join(destination, 'app/writing/page.tsx'));
const worksBoardPath = path.join(destination, 'app/works/WorksBoard.tsx');
await writeFile(worksBoardPath, (await readFile(worksBoardPath, 'utf8')).replace('<h2>作品与资料</h2>', '<h2>作品与资料</h2><div className="work-link-card"><h3>文本作品</h3><p>阅读我的文章、故事与章节。</p><Link className="personal-primary" href="/writing/">开始阅读 →</Link></div>'));
// Optional comment services are unavailable without the original API proxy.
for (const component of ['Comments', 'MomentComments']) await writeFile(path.join(destination, 'components', component + '.tsx'), `export default function ${component}(_props: any) { return <p className="personal-subtitle">评论暂未开放。</p>; }`);
// Prefix public asset URLs; Next handles its own Link and script paths via basePath.
const publicNames = (await readdir(path.join(root, 'public'))).map(name => name.replace(/[.*+?^\$\{\}()|[\]\\]/g, '\\$&')).join('|');
const assets = new RegExp('(["\x27\x60(])/(?:' + publicNames + ')(?=[/"\x27\x60)?#])', 'g');
const yamlAssets = new RegExp('^([ \\t]*(?:cover|avatar):[ \\t]*)/(?:' + publicNames + ')(?=[/\\s?#]|$)', 'gm');
async function prefixAssets(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['public', 'node_modules', '.next', 'out'].includes(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await prefixAssets(file);
    else if (/\.(tsx?|css|json|md)$/.test(entry.name)) {
      const source = await readFile(file, 'utf8');
      const prefixed = source.replace(assets, match => match[0] + '/myblog' + match.slice(1));
      await writeFile(file, entry.name.endsWith('.md')
        ? prefixed.replace(yamlAssets, (match, label) => label + '/myblog' + match.slice(label.length))
        : prefixed);
    }
  }
}
await prefixAssets(destination);
