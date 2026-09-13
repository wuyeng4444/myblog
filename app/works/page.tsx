import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { siteConfig } from '../../siteConfig';
import WorksBoard from './WorksBoard';

export const metadata = { title: '作品 | ' + siteConfig.title, description: '无影的作品与相关链接' };

export default function WorksPage() {
  return <><Navbar /><main className="personal-subpage">
    <Link href="/" className="personal-back">← 回到首页</Link>
    <p className="personal-eyebrow">WORKS / 作品</p>
    <h1>我做过和正在做的事。</h1>
    <p className="personal-subtitle">这里收录我的作品、网盘链接和相关资料。</p>
    <WorksBoard />
  </main></>;
}
