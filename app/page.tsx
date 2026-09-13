import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import HomeIntro from '../components/HomeIntro';
import RecentMoments from '../components/RecentMoments';

function readEntries(folder: string) {
  const directory = path.join(process.cwd(), folder);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter(name => name.endsWith('.md')).map(name => {
    const { data, content } = matter(fs.readFileSync(path.join(directory, name), 'utf8'));
    return { slug: name.replace(/\.md$/, ''), title: String(data.title || ''), description: String(data.description || ''), date: String(data.date || ''), content: content.trim() };
  }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
function dateLabel(date: string) {
  const value = new Date(date);
  return Number.isNaN(value.getTime()) ? '' : value.toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' });
}
export default function Home() {
  const posts = readEntries('posts');

  return <><Navbar /><main className="personal-home">
    <HomeIntro />
    <section id="work" className="personal-section" aria-labelledby="work-title">
      <div className="personal-section-heading"><div><p className="personal-eyebrow">01 / 正在创作</p><h2 id="work-title">我的世界，从这里展开。</h2></div></div>
      <article className="personal-work"><div className="personal-work-copy"><span className="personal-tag">世界观作品 · 持续更新</span><h3>帝国示录<span>我们是始嗣</span></h3><p>一个以「死亡帝国」为核心的世界。始嗣、人物、空间法则与异空间诸国，在这里一点点长出轮廓。</p><div className="personal-actions"><a className="personal-primary" href="https://wuyeng4444.github.io/-/" target="_blank" rel="noopener noreferrer">进入设定集 →</a></div></div><img src="/gallery/cover.jpg" alt="《帝国示录》欢颂人物插画" width="700" height="500" /></article>
    </section>
    <div className="personal-writing-grid">
      <section className="personal-section" aria-labelledby="writing-title"><div className="personal-section-heading"><div><p className="personal-eyebrow">02 / 文字留下的痕迹</p><h2 id="writing-title">最近写下</h2></div></div><div className="personal-posts">{posts.map(post => <Link className="personal-post" key={post.slug} href={`/posts/${post.slug}`}><time>{dateLabel(post.date)}</time><h3>{post.title}<span aria-hidden="true">↗</span></h3><p>{post.description}</p></Link>)}{posts.length === 0 && <p>下一篇文字，还在酝酿。</p>}</div></section>
      <section className="personal-section" aria-labelledby="moments-title"><div className="personal-section-heading"><div><p className="personal-eyebrow">03 / 生活的旁白</p><h2 id="moments-title">最近的我</h2></div><Link href="/moments">更多说说 ↗</Link></div><RecentMoments /></section>
    </div>
    <footer className="personal-footer"><div><strong>无影 の 藏身处</strong><p>谢谢你来过我的一小块互联网。</p></div><div><Link href="/friends">去朋友家坐坐 ↗</Link><span>© {new Date().getFullYear()} 无影</span></div></footer>
  </main></>;
}


