'use client';
import { useEffect, useState } from 'react';
import type { Moment } from '../lib/moments';
export default function RecentMoments() {
  const [moments, setMoments] = useState<Moment[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { fetch('/api/moments', { cache: 'no-store' }).then(async response => {
    if (!response.ok) throw new Error();
    const data = await response.json(); setMoments(data.moments.sort((a: Moment, b: Moment) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 2));
  }).catch(() => setError(true)); }, []);
  return <div className="personal-notes">{moments?.map(moment => <article key={moment.id}><time>{new Date(moment.date).toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' })}</time><p>{moment.content.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/[*#`]/g, '').slice(0, 180)}</p></article>)}{moments?.length === 0 && <p>有了新鲜事，就记在这里。</p>}{!moments && <p>{error ? '说说暂时无法加载，请稍后再试。' : '正在读取最近的说说…'}</p>}</div>;
}
