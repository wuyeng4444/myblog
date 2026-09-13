import Link from 'next/link';
import Navbar from '../../components/Navbar';
export const metadata = { title: '内容管理 | 无影', robots: { index: false, follow: false } };
const repository = 'https://github.com/wuyeng4444/myblog';
export default function AdminPage() {
  return <><Navbar /><main className="personal-subpage"><Link className="personal-back" href="/">← 回到首页</Link><p className="personal-eyebrow">内容管理</p><h1>写下新的故事</h1><p className="personal-subtitle">在可视化后台填写内容、上传图片、编排正文。使用 GitHub 账号登录，选择 myblog 仓库和 main 分支，保存后网站自动更新。</p>
    <div className="work-link-card"><h2>可视化编辑后台</h2><p>首页介绍、说说、文本作品与章节、网盘作品，都可以用中文表单编辑。首次使用需要授权 Pages CMS 访问 myblog 仓库。</p><a className="personal-primary" href="https://app.pagescms.org/" target="_blank" rel="noopener noreferrer">打开可视化后台 ↗</a></div>
    <div className="work-link-card"><h2>文本作品与章节</h2><p>支持正文排版、插入图片、设置作品名称和章节顺序。新文章默认存为草稿，关闭草稿开关后才会展示在网站上。公开仓库里的草稿仍可在 GitHub 中查看。</p><Link className="personal-secondary" href="/writing/">查看已发布的文字 →</Link></div>
    <details><summary>备用：直接在 GitHub 编辑</summary>
    <div className="work-link-card"><h2>首页介绍</h2><p>修改名字、问候语和个人介绍。</p><a className="personal-primary" href={`${repository}/edit/main/content/home-content.json`} target="_blank" rel="noopener noreferrer">编辑首页介绍 ↗</a></div>
    <div className="work-link-card"><h2>说说</h2><p>添加、修改或删除说说条目。每条说说包含时间、正文和图片链接，已有条目的 id 请保留。</p><a className="personal-primary" href={`${repository}/edit/main/content/moments.json`} target="_blank" rel="noopener noreferrer">管理说说 ↗</a></div>
    <div className="work-link-card"><h2>作品与网盘</h2><p>修改作品名称、简介、网盘链接和提取码。</p><a className="personal-primary" href={`${repository}/edit/main/content/works.json`} target="_blank" rel="noopener noreferrer">管理作品 ↗</a></div>
    </details><div className="personal-actions"><a className="personal-secondary" href={`${repository}/blob/main/content/README.md`} target="_blank" rel="noopener noreferrer">查看使用说明 ↗</a><a className="personal-secondary" href={`${repository}/actions/workflows/pages.yml`} target="_blank" rel="noopener noreferrer">查看发布进度 ↗</a></div>
  </main></>;
}
