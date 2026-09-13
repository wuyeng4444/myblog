import test from 'node:test';
import assert from 'node:assert/strict';
import { validateWorks } from '../lib/works.ts';
const entry = { id: 'one', title: ' 小说 ', description: '', url: 'https://pan.baidu.com/s/example', code: 'abcd' };
test('preserves a cloud link and extraction code', () => {
  assert.deepEqual(validateWorks([entry]), [{ ...entry, title: '小说' }]);
  assert.deepEqual(validateWorks([]), []);
});
test('rejects executable URLs and malformed catalogs', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,hello', 'https://user:password@example.com', 'invalid']) assert.throws(() => validateWorks([{ ...entry, url }]));
  assert.throws(() => validateWorks([entry, entry]));
  assert.throws(() => validateWorks([{ ...entry, title: '' }]));
  assert.throws(() => validateWorks(Array(101).fill(entry)));
});
