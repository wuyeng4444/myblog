'use client';
import { useEffect, useState } from 'react';
export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState(false), [password, setPassword] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState(true);
  useEffect(() => { fetch('/api/admin/session').then(r => r.json()).then(data => setAdmin(data.authenticated)).catch(() => setMessage('无法连接，请重试')).finally(() => setBusy(false)); }, []);
  async function login(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error); setAdmin(true); setPassword('');
    } catch (error) { setMessage(error instanceof Error ? error.message : '登录失败'); } finally { setBusy(false); }
  }
  if (admin) return <>{children}</>;
  return <form onSubmit={login}><label>管理员密码<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label><button className="personal-primary" disabled={busy}>{busy ? '正在连接…' : '登录'}</button>{message && <p role="status">{message}</p>}</form>;
}
