'use client';
import { useEffect, useState } from 'react';
import MomentList from './MomentList';
import AdminGate from '../../components/AdminGate';
import type { Moment } from '../../lib/moments';
import { siteConfig } from '../../siteConfig';
const localDate = (date: string) => { const d = new Date(date); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
export default function MomentsBoard() {
  const [moments, setMoments] = useState<Moment[]>([]), [revision, setRevision] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false), [manage, setManage] = useState(false), [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Moment | null>(null), [undo, setUndo] = useState<Moment | null>(null);
  const [images, setImages] = useState(''), [message, setMessage] = useState(''), [remove, setRemove] = useState<string | null>(null);
  async function load() {
    try { const response = await fetch('/api/moments', { cache: 'no-store' }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setMoments(data.moments); setRevision(data.revision); setLoaded(true); setMessage(''); }
    catch (error) { setMessage(error instanceof Error ? error.message : '加载失败'); }
  }
  useEffect(() => { void load(); }, []);
  async function save(next: Moment[], success: string) {
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/moments', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ moments: next, revision }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setMoments(data.moments); setRevision(data.revision); setMessage(success); return true;
    } catch (error) { setMessage(error instanceof Error ? error.message : '保存失败'); return false; } finally { setBusy(false); }
  }
  function edit(moment: Moment) { setDraft({ ...moment }); setImages(moment.images.join('\n')); setRemove(null); }
  return <><div className="personal-subpage" style={{ paddingBottom: 0, paddingTop: 28 }}>
    <button className="personal-secondary" onClick={() => setManage(!manage)}>{manage ? '收起管理' : '管理说说'}</button>
    {manage && <div className="works-editor"><AdminGate><h2>说说管理</h2>
      <button className="personal-primary" disabled={busy || !loaded} onClick={() => edit({ id: crypto.randomUUID(), date: new Date().toISOString(), content: '', images: [], location: '' })}>＋ 发说说</button>
      {draft && <form onSubmit={async event => {
        event.preventDefault(); const updated = { ...draft, images: images.split('\n').map(v => v.trim()).filter(Boolean) };
        const next = moments.some(m => m.id === updated.id) ? moments.map(m => m.id === updated.id ? updated : m) : [updated, ...moments];
        if (await save(next, '已发布，首页也会显示最新说说。')) setDraft(null);
      }}><fieldset disabled={busy}><label>说说内容<textarea required maxLength={10000} value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })} /></label><label>时间<input type="datetime-local" required value={localDate(draft.date)} onChange={e => { if (e.target.value) setDraft({ ...draft, date: new Date(e.target.value).toISOString() }); }} /></label><label>地点（选填）<input maxLength={150} value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value })} /></label><label>图片链接（选填，每行一张，最多 9 张）<textarea value={images} onChange={e => setImages(e.target.value)} placeholder="https://…" /></label><div className="personal-actions"><button className="personal-primary">{busy ? '正在保存…' : '发布 / 保存'}</button><button type="button" className="personal-secondary" onClick={() => setDraft(null)}>取消编辑</button></div></fieldset></form>}
      {[...moments].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).map(moment => <div className="work-edit-row" key={moment.id}><time>{new Date(moment.date).toLocaleString('zh-CN')}</time><p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', margin: '12px 0' }}>{moment.content.slice(0, 220)}</p><div className="personal-actions"><button className="personal-secondary" disabled={busy} onClick={() => edit(moment)}>编辑</button><button className="personal-secondary" disabled={busy} onClick={() => setRemove(moment.id)}>删除</button></div>{remove === moment.id && <div><p>确定删除这条说说？</p><button className="personal-secondary" disabled={busy} onClick={async () => { if (await save(moments.filter(m => m.id !== moment.id), '已删除，可撤销本次删除。')) { setUndo(moment); setRemove(null); if (draft?.id === moment.id) setDraft(null); } }}>确认删除</button> <button className="personal-secondary" disabled={busy} onClick={() => setRemove(null)}>取消</button></div>}</div>)}
      {undo && <button className="personal-secondary" disabled={busy} onClick={async () => { if (await save([...moments.filter(m => m.id !== undo.id), undo], '已恢复说说。')) setUndo(null); }}>撤销上次删除</button>}
    </AdminGate></div>}
    {message && <p className="works-feedback" role="status">{message}</p>}
    {!loaded && <button className="personal-secondary" onClick={load}>重新加载说说</button>}
  </div>{loaded && <MomentList moments={moments} authorName={siteConfig.authorName} avatarUrl={siteConfig.avatarUrl} />}</>;
}
