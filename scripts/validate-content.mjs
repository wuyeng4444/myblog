import { readFile } from 'node:fs/promises';
import { validateHome } from '../lib/home-content.ts';
import { validateMoments } from '../lib/moments.ts';
import { validateWorks } from '../lib/works.ts';
for (const [name, field, validate] of [['home-content','content',validateHome],['moments','moments',validateMoments],['works','works',validateWorks]]) {
  const data = JSON.parse((await readFile(new URL('../content/' + name + '.json', import.meta.url), 'utf8')).replace(/^\uFEFF/, ''));
  validate(data[field]);
  console.log(name + ': valid');
}
