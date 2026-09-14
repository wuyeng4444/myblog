import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { siteConfig } from '../../siteConfig';
import WorksBoard from './WorksBoard';

export const metadata = { title: '作品 | ' + siteConfig.title, description: '无影的作品与相关链接' };

export default function WorksPage() {
  return <><Navbar /><main className="personal-subpage">
    <Link href="/" className="personal-back">← 回到首页</Link>
    <p className="personal-eyebrow">WORKS / 作品</p>
    <h1>把做好的东西，放在这里。</h1>
    <p className="personal-subtitle">这里整理可以分享的作品与资料。点击卡片中的链接前往网盘，下载时如需提取码，可在卡片上找到。</p>
    <WorksBoard />
  </main></>;
}
