"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';
const links = [{name:'首页',href:'/'},{name:'作品',href:'/works'},{name:'说说',href:'/moments'},{name:'友链',href:'/friends'},{name:'关于',href:'/about'}];
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  return <header className="personal-nav"><div className="personal-nav-inner">
    <Link className="personal-brand" href="/" onClick={() => setOpen(false)}>无影<span>の 藏身处</span></Link>
    <div className="personal-nav-controls"><button className="personal-theme" onClick={toggleTheme} aria-label={isDark ? '切换浅色模式' : '切换深色模式'}>{isDark ? '☼' : '☾'}</button><button className="personal-menu" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? '关闭' : '菜单'}</button></div>
    <nav id="main-navigation" aria-label="主导航" className={open ? 'personal-links is-open' : 'personal-links'}>{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined} onClick={() => setOpen(false)}>{link.name}</Link>)}<a href="https://wuyeng4444.github.io/-/" target="_blank" rel="noopener noreferrer">设定集 ↗</a></nav>
  </div></header>;
}
