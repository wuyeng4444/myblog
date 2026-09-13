import test from 'node:test';
import assert from 'node:assert/strict';
import { validateMoments } from '../lib/moments.ts';
import { defaultHome, validateHome } from '../lib/home-content.ts';
const item = { id: 'existing', date: '2026-09-12T02:05:00Z', content: '第一行\n第二行', location: '', images: ['/gallery/hymne-1.jpg'] };
test('moments retain identity, multiline text and dates through edits; empty catalog stays empty', () => {
  assert.deepEqual(validateMoments([item]), [item]);
  assert.equal(validateMoments([{ ...item, content: '修改后的说说' }])[0].id, item.id);
  assert.deepEqual(validateMoments([]), []);
});
test('reject invalid dates, duplicate ids, oversized or executable image URLs', () => {
  for (const change of [{ date: 'invalid' }, { content: '' }, { content: 'x'.repeat(10001) }, { images: ['javascript:alert(1)'] }, { images: ['//example.com/x.jpg'] }, { images: Array(10).fill('/gallery/a.jpg') }]) assert.throws(() => validateMoments([{ ...item, ...change }]));
  assert.throws(() => validateMoments([item, item]));
});
test('home edits preserve complete content and enforce bounds', () => {
  assert.deepEqual(validateHome(defaultHome), defaultHome);
  assert.equal(validateHome({ ...defaultHome, introduction: '我的新介绍' }).introduction, '我的新介绍');
  assert.throws(() => validateHome({ ...defaultHome, name: '' }));
  assert.throws(() => validateHome({ ...defaultHome, introduction: 'x'.repeat(2001) }));
});
