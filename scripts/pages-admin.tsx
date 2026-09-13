import Link from 'next/link';
import Navbar from '../../components/Navbar';
export const metadata = { title: '内容管理 | 无影', robots: { index: false, follow: false } };
const repository = 'https://github.com/wuyeng4444/myblog';
export default function AdminPage() {
  return <><Navbar /><main className="personal-subpage"><Link className="personal-back" href="/">← 回到首页</Link><p className="personal-eyebrow">内容管理</p><h1>更新我的网站</h1><p className="personal-subtitle">使用你的 GitHub 账号登录。修改后点击「Commit changes…」保存到 main，网站会自动发布，通常需要几分钟。</p>
    <div className="work-link-card"><h2>首页介绍</h2><p>修改名字、问候语和个人介绍。</p><a className="personal-primary" href={`${repository}/edit/main/content/home-content.json`} target="_blank" rel="noopener noreferrer">编辑首页介绍 ↗</a></div>
    <div className="work-link-card"><h2>说说</h2><p>添加、修改或删除说说条目。每条说说包含时间、正文和图片链接，已有条目的 id 请保留。</p><a className="personal-primary" href={`${repository}/edit/main/content/moments.json`} target="_blank" rel="noopener noreferrer">管理说说 ↗</a></div>
    <div className="work-link-card"><h2>作品与网盘</h2><p>修改作品名称、简介、网盘链接和提取码。</p><a className="personal-primary" href={`${repository}/edit/main/content/works.json`} target="_blank" rel="noopener noreferrer">管理作品 ↗</a></div>
    <div className="personal-actions"><a className="personal-secondary" href={`${repository}/blob/main/content/README.md`} target="_blank" rel="noopener noreferrer">查看填写示例 ↗</a><a className="personal-secondary" href={`${repository}/actions/workflows/pages.yml`} target="_blank" rel="noopener noreferrer">查看发布进度 ↗</a></div>
  </main></>;
}
