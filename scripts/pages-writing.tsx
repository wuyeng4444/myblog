import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
export const metadata = { title: '文本作品 | 无影' };
export default function WritingPage() {
  const directory = path.join(process.cwd(), 'posts');
  const entries = fs.readdirSync(directory).filter(name => name.endsWith('.md')).map(name => {
    const { data } = matter(fs.readFileSync(path.join(directory, name), 'utf8'));
    return { slug: name.replace(/\.md$/, ''), title: String(data.title || name), description: String(data.description || ''), series: String(data.series || '独立文章'), order: Number(data.order || 0), date: String(data.date || '') };
  });
  const groups = [...new Set(entries.map(entry => entry.series))];
  return <><Navbar /><main className="personal-subpage"><Link href="/works/" className="personal-back">← 回到作品</Link><p className="personal-eyebrow">文字 / 故事 / 章节</p><h1>写下的世界</h1>{groups.map(series => <section className="works-downloads" key={series}><h2>{series}</h2>{entries.filter(entry => entry.series === series).sort((a,b) => a.order-b.order || Date.parse(b.date)-Date.parse(a.date)).map(entry => <Link className="personal-post" key={entry.slug} href={`/posts/${entry.slug}/`}><h3>{entry.title} →</h3><p>{entry.description}</p></Link>)}</section>)}{!entries.length && <p>故事还在酝酿。</p>}</main></>;
}
