const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '../offline/family-story-share-preview-offline.html'), 'utf8');
const between = html.split('// STORY_CORE_BEGIN')[1]?.split('// STORY_CORE_END')[0]?.replace(/^[^\n]*\n/, '');
assert.ok(between, 'must test the exact self-contained HTML core');
const api = vm.runInNewContext(`${between}\n({parseStory,makeSharePreview,makePrivateBackup})`);
const { parseStory, makeSharePreview, makePrivateBackup } = api;

function approved(items, index = 0, audience = 'close') {
  items[index].decision = 'allow';
  items[index].audience = audience;
  items[index].narratorChecked = true;
  items[index].othersChecked = true;
  return items;
}

test('empty, blank, and line-limit inputs are rejected', () => {
  assert.throws(() => parseStory(' \n '), /至少一段/);
  assert.throws(() => parseStory(Array(13).fill('一段').join('\n')), /最多只能建立12段/);
  assert.throws(() => parseStory('字'.repeat(351)), /每段最多350字/);
});

test('emoji are counted as Unicode characters, Windows line endings accepted', () => {
  assert.equal(parseStory('🙂'.repeat(350)).length, 1);
  assert.throws(() => parseStory('🙂'.repeat(351)), /350字/);
  assert.deepEqual(Array.from(parseStory('甲\r\n 乙 \r\n').map(x => x.content)), ['甲','乙']);
});

test('every paragraph is private by default, not included in any audience', () => {
  const p = parseStory('公開可能傷害長輩\n私人筆記');
  for (const scope of ['close','wide']) {
    const result = makeSharePreview(p,scope);
    assert.equal(result.included.length,0);
    assert.equal(result.excluded.length,2);
    assert.equal(result.text,'');
  }
});

test('a marked paragraph never escapes without both separate self-attestations', () => {
  const p = parseStory('我同意這段');
  p[0].decision='allow';
  assert.equal(makeSharePreview(p,'close').included.length,0);
  assert.equal(makeSharePreview(p,'close').blockers.length,1);
  p[0].narratorChecked=true;
  assert.equal(makeSharePreview(p,'close').included.length,0);
  p[0].narratorChecked=false; p[0].othersChecked=true;
  assert.equal(makeSharePreview(p,'close').included.length,0);
  p[0].narratorChecked=true;
  assert.equal(makeSharePreview(p,'close').text,'我同意這段');
});

test('pending review stays excluded even after attestations', () => {
  const p = approved(parseStory('還沒審過'));
  p[0].decision='review';
  assert.equal(makeSharePreview(p,'close').included.length,0);
});

test('a core-family segment is excluded from wider relatives', () => {
  const p = approved(parseStory('僅給家人'));
  assert.equal(makeSharePreview(p,'close').text,'僅給家人');
  assert.equal(makeSharePreview(p,'wide').text,'');
});

test('a wider-circle segment is also available to the core family', () => {
  const p = approved(parseStory('可以讓親戚看'),0,'wide');
  assert.equal(makeSharePreview(p,'close').text,'可以讓親戚看');
  assert.equal(makeSharePreview(p,'wide').text,'可以讓親戚看');
});

test('mixed fictional story exports only selected paragraphs in stable source order', () => {
  const p = parseStory('雨天書店\n不公開的工作祕密\n門口的桂花');
  approved(p,0,'wide'); approved(p,2,'close');
  assert.equal(makeSharePreview(p,'close').text,'雨天書店\n\n門口的桂花');
  assert.equal(makeSharePreview(p,'wide').text,'雨天書店');
  assert.equal(makeSharePreview(p,'wide').text.includes('祕密'),false);
});

test('invalid sharing audience fails closed', () => {
  assert.throws(()=>makeSharePreview(approved(parseStory('安全')),'public'),/分享對象無效/);
});

test('the private backup explicitly labels its unshared contents as private', () => {
  const p = parseStory('不能給別人看');
  const backup=JSON.parse(makePrivateBackup(p));
  assert.match(backup.type,/PRIVATE/);
  assert.match(backup.caution,/切勿/);
  assert.equal(backup.segments[0].content,'不能給別人看');
});

test('standalone HTML has no remote scripts, automatic posting, analytics or storage', () => {
  assert.doesNotMatch(html,/<script\s+src=/i);
  assert.doesNotMatch(html,/<form\b/i);
  assert.doesNotMatch(html,/\bfetch\s*\(|\bXMLHttpRequest\b|\blocalStorage\b|\bsessionStorage\b|\bsendBeacon\b/);
  assert.match(html,/sourceEl\.addEventListener\('input'/);
  assert.match(html,/resetState\(\)/);
});
