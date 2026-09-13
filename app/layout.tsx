import 'katex/dist/katex.min.css';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { siteConfig } from '../siteConfig';
export const metadata: Metadata = { title: siteConfig.title, description: siteConfig.bio, icons: { icon: siteConfig.faviconUrl, apple: siteConfig.faviconUrl } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning><body className="min-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"><ThemeProvider><div id="app-mount-root">{children}</div></ThemeProvider></body></html>;
}
