import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Moment } from './moments';
export function seedMoments(): Moment[] {
  const result = new Map<string, Moment>();
  for (const folder of ['posts/moments', 'moments']) {
    const directory = path.join(process.cwd(), folder);
    if (!fs.existsSync(directory)) continue;
    for (const file of fs.readdirSync(directory).filter(name => name.endsWith('.md'))) {
      const { data, content } = matter(fs.readFileSync(path.join(directory, file), 'utf8'));
      const id = file.replace(/\.md$/, '');
      result.set(id, { id, date: new Date(data.date || '1970-01-01').toISOString(), content: content.trim(), location: data.location || '', images: data.images || [] });
    }
  }
  return [...result.values()];
}
