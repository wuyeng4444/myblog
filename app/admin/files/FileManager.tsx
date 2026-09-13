'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { upload } from '@vercel/blob/client';

type StoredFile = { pathname: string; size: number; uploadedAt: string };
const limit = 500 * 1024 * 1024;
function sizeLabel(size: number) { return size < 1024 * 1024 ? `${(size / 1024).toFixed(1)} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`; }
export default function FileManager() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [days, setDays] = useState(7);
  const [shareUrl, setShareUrl] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const input = useRef<HTMLInputElement>(null);
  async function api(url: string, init?: RequestInit) {
    const response = await fetch(url, { ...init, cache: 'no-store' });
    const data = await response.json();
    if (response.status === 401) { setLoggedIn(false); setFiles([]); setShareUrl(''); }
    if (!response.ok) throw new Error(data.error || '操作失败，请稍后重试');
    return data;
  }
  async function loadFiles(next?: string) {
    const data = await api(`/api/admin/files${next ? `?cursor=${encodeURIComponent(next)}` : ''}`);
    setFiles(previous => next ? [...previous, ...data.files] : data.files);
    setCursor(data.cursor);
  }
  useEffect(() => {
    api('/api/admin/session').then(async data => { setLoggedIn(data.authenticated); if (!data.configured) setMessage('管理员登录尚未配置，请联系网站维护者。'); if (data.authenticated) await loadFiles(); }).catch(error => { setLoggedIn(false); setMessage(error.message); });
  }, []);
  async function makeShare(pathname: string) {
    const data = await api('/api/admin/share', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pathname, days }) });
    setShareUrl(data.url); setExpiresAt(data.expiresAt);
  }
  return <main className="file-admin"><Link href="/">← 回到首页</Link><h1>文件管理</h1><p className="file-muted">文件不展示在网站上。上传完成后，把下载链接发给需要的人。</p>
    <p role="status" aria-live="polite">{message}</p>
    {loggedIn === null ? <p>正在检查登录状态…</p> : !loggedIn ? <form className="file-panel" onSubmit={async event => {
      event.preventDefault(); setBusy(true); setMessage('');
      try { await api('/api/admin/session', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({password}) }); setPassword(''); setLoggedIn(true); await loadFiles(); } catch(error) { setMessage((error as Error).message); } finally { setBusy(false); }
    }}><h2>管理员登录</h2><label htmlFor="admin-password">管理员密码</label><input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} /><button disabled={busy}>{busy ? '正在登录…' : '登录'}</button></form> : <>
      <div className="file-toolbar"><span>管理员已登录</span><button disabled={busy} onClick={async()=>{ try { await api('/api/admin/session',{method:'DELETE'}); setLoggedIn(false); setFiles([]); setShareUrl(''); setMessage('已退出登录'); } catch(error) { setMessage((error as Error).message); } }}>退出登录</button></div>
      <form className="file-panel" onSubmit={async event=>{
        event.preventDefault(); const file=input.current?.files?.[0]; if(!file) return;
        if(file.size > limit || file.size === 0) { setMessage('请选择非空文件，单个文件不超过 500 MB。'); return; }
        setBusy(true); setMessage('正在上传，请保持页面打开…'); setProgress(0); setShareUrl('');
        try {
          const filename = file.name.normalize('NFC').replace(/[^\p{L}\p{N}_. ()-]/gu,'_').replace(/\.{2,}/g,'_').slice(-180) || 'file';
          const blob = await upload(`files/${crypto.randomUUID()}/${filename}`, file, { access:'private', handleUploadUrl:'/api/admin/upload', multipart:true, onUploadProgress:event=>setProgress(Math.round(event.percentage)) });
          setMessage('文件已上传。正在生成下载链接…'); if(input.current) input.current.value='';
          await makeShare(blob.pathname); await loadFiles(); setMessage('上传完成，可以复制下方链接分享。');
        } catch(error) { setMessage(`操作未完成：${(error as Error).message}。若已上传，可刷新文件记录后重新生成链接。`); } finally {setBusy(false); setProgress(null);}
      }}><h2>上传文件</h2><label htmlFor="upload-file">选择图片、视频或其他文件</label><input id="upload-file" type="file" ref={input} required disabled={busy} /><p className="file-muted">每次上传一个文件，单个文件最多 500 MB。文件不会自动出现在公开页面。</p><label htmlFor="share-days">下载链接有效期</label><select id="share-days" value={days} onChange={e=>setDays(Number(e.target.value))} disabled={busy}><option value={1}>1 天</option><option value={7}>7 天</option><option value={30}>30 天</option></select><button disabled={busy}>{progress !== null ? `上传中 ${progress}%` : '上传并生成下载链接'}</button>{progress !== null && <progress max={100} value={progress} aria-label="上传进度" />}</form>
      {shareUrl && <section className="file-panel"><h2>下载链接</h2><label htmlFor="download-link">复制后发给访问者</label><input id="download-link" readOnly value={shareUrl} onFocus={e=>e.target.select()} /><p className="file-muted">有效至 {new Date(expiresAt).toLocaleString('zh-CN')}。持有链接的人可以下载，请只发给你想分享的人。</p><button onClick={async()=>{try {await navigator.clipboard.writeText(shareUrl);setMessage('下载链接已复制');} catch {setMessage('自动复制失败，请选中链接手动复制。');}}}>复制链接</button></section>}
      <section className="file-panel"><div className="file-toolbar"><h2>我的文件</h2><button disabled={busy} onClick={()=>loadFiles().catch(error=>setMessage(error.message))}>刷新</button></div><p className="file-muted">此记录仅管理员可见，不显示图片或视频预览。</p>{files.length === 0 ? <p>还没有上传文件。</p> : files.map(file=><article className="file-row" key={file.pathname}><div><strong>{file.pathname.split('/').pop()}</strong><p className="file-muted">{sizeLabel(file.size)} · {new Date(file.uploadedAt).toLocaleString('zh-CN')}</p></div><button disabled={busy} onClick={async()=>{setBusy(true); try {await makeShare(file.pathname);setMessage('新下载链接已生成，请在上方复制。');} catch(error){setMessage((error as Error).message);}finally{setBusy(false);}}}>生成链接</button></article>)}{cursor && <button disabled={busy} onClick={()=>loadFiles(cursor).catch(error=>setMessage(error.message))}>加载更多</button>}</section>
    </>}
  </main>;
}
