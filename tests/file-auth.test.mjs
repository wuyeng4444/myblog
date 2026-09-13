import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { seal,unseal,passwordMatches,isAdmin,sameOrigin,validPath,COOKIE } from '../lib/file-auth.ts';
process.env.FILE_ADMIN_SECRET='test-only-random-secret-never-for-production';
process.env.FILE_ADMIN_PASSWORD_HASH=createHash('sha256').update('test-password').digest('hex');
test('administrator authentication rejects wrong password and absent session',()=>{
  assert.equal(passwordMatches('wrong'),false); assert.equal(passwordMatches('test-password'),true);
  assert.equal(isAdmin(new Request('https://example.test/api/admin/files')),false);
  const token=seal({purpose:'admin',exp:Date.now()+60000});
  assert.equal(isAdmin(new Request('https://example.test/api/admin/files',{headers:{cookie:`${COOKIE}=${token}`}})),true);
});
test('tampered, expired and wrong-purpose tokens cannot grant access',()=>{
  const token=seal({purpose:'download',pathname:'files/12345678-1234-1234-1234-123456789012/a.png',exp:Date.now()+60000});
  assert.ok(unseal(token,'download')); assert.equal(unseal(token,'admin'),null);
  assert.equal(unseal(token+'x','download'),null);
  assert.equal(unseal(seal({purpose:'admin',exp:Date.now()-1}),'admin'),null);
});
test('only same-origin mutations and scoped filenames are accepted',()=>{
  assert.equal(sameOrigin(new Request('https://example.test/api/admin/session',{headers:{origin:'https://evil.test'}})),false);
  assert.equal(sameOrigin(new Request('https://example.test/api/admin/session',{headers:{origin:'https://example.test'}})),true);
  assert.equal(validPath('files/12345678-1234-1234-1234-123456789012/图片.png'),true);
  assert.equal(validPath('files/12345678-1234-1234-1234-123456789012/../../secret'),false);
  assert.equal(validPath('https://evil.test/file'),false);
});
