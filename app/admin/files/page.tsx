import type { Metadata } from 'next';
import FileManager from './FileManager';
export const metadata: Metadata = { title: '文件管理 · 无影', robots: { index: false, follow: false } };
export default function FilesPage() { return <FileManager />; }
