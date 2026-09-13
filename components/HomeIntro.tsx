'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminGate from './AdminGate';
import { defaultHome, type HomeContent } from '../lib/home-content';
import { siteConfig } from '../siteConfig';
export default function HomeIntro() {
  const [content, setContent] = useState(defaultHome), [draft, setDraft] = useState(defaultHome);
  const [revision, setRevision] = useState<string | null>(null), [message, setMessage] = useState('');
  const [loaded, setLoaded] = useState(false), [manage, setManage] = useState(false), [busy, setBusy] = useState(false);
  async function load() {
    try { const response = await fetch('/api/home-content', { cache: 'no-store' }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setContent(data.content); setDraft(data.content); setRevision(data.revision); setLoaded(true); setMessage(''); }
    catch { setMessage('暂时无法读取最新介绍，请稍后重试。'); }
  }
  useEffect(() => { void load(); }, []);
  const labels: Record<keyof HomeContent, string> = { eyebrow: '顶部小标题', greeting: '问候语', name: '名字', lead: '一句话介绍（可换行）', introduction: '个人介绍', caption: '头像下方文字' };
  return <><section className="personal-hero" aria-labelledby="intro-title"><div>
    <p className="personal-eyebrow">{content.eyebrow}</p><h1 id="intro-title">{content.greeting}<span>{content.name}</span></h1>
    <p className="personal-lead" style={{ whiteSpace: 'pre-line' }}>{content.lead}</p><p className="personal-intro" style={{ whiteSpace: 'pre-wrap' }}>{content.introduction}</p>
    <div className="personal-actions"><Link className="personal-primary" href="/works">看看我的作品 ↗</Link><Link className="personal-secondary" href="/about">多认识我一点 →</Link></div>
    <a className="personal-github" href={siteConfig.social.github} target="_blank" rel="noopener noreferrer">GitHub / wuyeng4444 ↗</a>
    <div><button className="personal-secondary works-manage" onClick={() => setManage(!manage)}>{manage ? '收起编辑' : '编辑首页介绍'}</button></div>
  </div><div className="personal-portrait"><div className="portrait-orbit" aria-hidden="true" /><img src={siteConfig.avatarUrl} alt="无影的头像" width="280" height="280" /><p>{content.caption}</p></div></section>
  {manage && <div className="works-editor"><AdminGate><h2>编辑首页介绍</h2><form onSubmit={async event => {
    event.preventDefault(); setBusy(true); setMessage('');
    try { const response = await fetch('/api/home-content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: draft, revision }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setContent(data.content); setDraft(data.content); setRevision(data.revision); setMessage('首页介绍已更新。'); }
    catch (error) { setMessage(error instanceof Error ? error.message : '保存失败'); } finally { setBusy(false); }
  }}><fieldset disabled={busy || !loaded}>{(Object.keys(labels) as (keyof HomeContent)[]).map(key => <label key={key}>{labels[key]}<textarea required maxLength={key === 'introduction' ? 2000 : 300} value={draft[key]} onChange={e => setDraft({ ...draft, [key]: e.target.value })} /></label>)}<div className="personal-actions"><button className="personal-primary">{busy ? '正在保存…' : '保存首页介绍'}</button><button type="button" className="personal-secondary" onClick={() => { setDraft(content); setManage(false); }}>取消</button></div></fieldset></form></AdminGate></div>}
  {message && <p role="status">{message}</p>}{manage && !loaded && <button onClick={load}>重新加载</button>}
  </>;
}
