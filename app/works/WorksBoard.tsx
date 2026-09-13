'use client';
import { useEffect, useState } from 'react';
import type { Work } from '../../lib/works';

export default function WorksBoard() {
  const [works, setWorks] = useState<Work[]>([]);
  const [draft, setDraft] = useState<Work[]>([]);
  const [revision, setRevision] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [manage, setManage] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function load() {
    try {
      const response = await fetch('/api/works', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setWorks(data.works); setDraft(data.works); setRevision(data.revision); setLoaded(true); setMessage('');
    } catch (error) { setMessage(error instanceof Error ? error.message : '加载失败'); }
  }
  useEffect(() => { void load(); }, []);
  async function openEditor() {
    setManage(true);
    try { const response = await fetch('/api/admin/session'); const data = await response.json(); setAdmin(data.authenticated); }
    catch { setMessage('无法连接，请稍后重试'); }
  }
  async function login(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setAdmin(true); setPassword('');
    } catch (error) { setMessage(error instanceof Error ? error.message : '登录失败'); }
    finally { setBusy(false); }
  }
  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/works', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ works: draft, revision }) });
      const data = await response.json();
      if (response.status === 401) setAdmin(false);
      if (!response.ok) throw new Error(data.error);
      setWorks(data.works); setDraft(data.works); setRevision(data.revision); setMessage('已发布，访客现在可以查看这些链接。');
    } catch (error) { setMessage(error instanceof Error ? error.message : '保存失败'); }
    finally { setBusy(false); }
  }
  function change(id: string, key: keyof Work, value: string) { setDraft(items => items.map(item => item.id === id ? { ...item, [key]: value } : item)); }
  return <section className="works-downloads">
    <p className="personal-eyebrow">COLLECTION / 作品与下载</p><h2>作品与资料</h2>
    {loaded && !works.length && <p className="personal-subtitle">作品链接正在整理，稍后再来看看。</p>}
    {!loaded && <p className="personal-subtitle">{message ? '暂时无法读取作品。' : '正在加载作品…'}</p>}
    {works.map(work => <article className="work-link-card" key={work.id}><h3>{work.title}</h3>{work.description && <p>{work.description}</p>}<div className="personal-actions"><a className="personal-primary" href={work.url} target="_blank" rel="noopener noreferrer">打开网盘 / 查看作品 ↗</a>{work.code && <span>提取码：<code>{work.code}</code></span>}</div></article>)}
    {!manage && <button className="personal-secondary works-manage" onClick={openEditor}>管理作品</button>}
    {manage && <div className="works-editor"><h3>管理作品</h3><p>填写作品名称和网盘链接，发布后会展示在此页。</p>
      {!admin ? <form onSubmit={login}><label>管理员密码<input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} /></label><button className="personal-primary" disabled={busy}>登录</button></form> :
      <form onSubmit={save}><fieldset disabled={busy || !loaded}>
        {draft.map((work, index) => <div className="work-edit-row" key={work.id}><h4>作品 {index + 1}</h4><label>作品名称<input required maxLength={100} value={work.title} onChange={e => change(work.id, 'title', e.target.value)} /></label><label>简介（选填）<textarea maxLength={2000} value={work.description} onChange={e => change(work.id, 'description', e.target.value)} /></label><label>网盘链接<input type="url" required maxLength={2048} placeholder="https://" value={work.url} onChange={e => change(work.id, 'url', e.target.value)} /></label><label>提取码（选填）<input maxLength={100} value={work.code} onChange={e => change(work.id, 'code', e.target.value)} /></label><button type="button" className="personal-secondary" onClick={() => setDraft(items => items.filter(item => item.id !== work.id))}>移除此作品</button></div>)}
        <div className="personal-actions"><button type="button" className="personal-secondary" disabled={draft.length >= 100} onClick={() => setDraft(items => [...items, { id: crypto.randomUUID(), title: '', description: '', url: '', code: '' }])}>＋ 添加作品</button><button className="personal-primary">{busy ? '正在发布…' : '发布更改'}</button></div>
      </fieldset></form>}
      <button className="personal-secondary works-manage" disabled={busy} onClick={() => { setManage(false); setDraft(works); setMessage(''); }}>关闭编辑</button>
    </div>}
    {message && <p role="status" className="works-feedback">{message}</p>}
    {!loaded && message && <button className="personal-secondary" onClick={load}>重新加载</button>}
  </section>;
}
