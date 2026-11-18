#!/usr/bin/env node
/**
 * Offline, dependency-free regression for the public fictional handoff guide.
 * Run from growth-desk: node tests/shot-handoff-comparison-guide.test.cjs
 * Optional QA overrides: --tool=/absolute/path --guide=/absolute/path --expected=/absolute/path --delivered=/absolute/path
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const option = (name, fallback) => {
  const arg = process.argv.slice(2).find(value => value.startsWith(name + '='));
  return arg ? arg.slice(name.length + 1) : fallback;
};
const toolPath = option('--tool', path.join(root, 'offline/shot-handoff-preflight-offline.html'));
const guidePath = option('--guide', path.join(root, 'guides/shot-handoff-comparison-field-guide.md'));
const expectedPath = option('--expected', path.join(root, 'examples/shot-handoff-expected.csv'));
const deliveredPath = option('--delivered', path.join(root, 'examples/shot-handoff-delivered.csv'));
const html = fs.readFileSync(toolPath, 'utf8');
const guide = fs.readFileSync(guidePath, 'utf8');
const expectedCsv = fs.readFileSync(expectedPath, 'utf8').trimEnd();
const deliveredCsv = fs.readFileSync(deliveredPath, 'utf8').trimEnd();

const firstScript = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(firstScript?.includes('Moruneva Shot Handoff Preflight v1'), 'v1 core inline script is present');
const sandbox = { module: { exports: {} } };
vm.runInNewContext(firstScript, sandbox, { timeout: 2500, filename: 'shot-handoff-v1-core.js' });
const core = sandbox.module.exports;

const csvBlocks = [...guide.matchAll(/```csv\r?\n([\s\S]*?)\r?\n```/g)].map(match => match[1]);
assert.equal(csvBlocks.length, 2, 'exactly two fictional CSV blocks in the public guide');
assert.equal(expectedCsv, csvBlocks[0], 'downloadable expected CSV matches the public guide');
assert.equal(deliveredCsv, csvBlocks[1], 'downloadable delivered CSV matches the public guide');

const expected = core.parseDelimited(expectedCsv, 'expected');
const delivered = core.parseDelimited(deliveredCsv, 'delivered');
const result = core.analyze({ contract_version: core.INPUT_CONTRACT, expected, delivered });
assert.deepEqual(JSON.parse(JSON.stringify(result.summary)), {
  expected: 5, delivered: 5, metadata_matched: 2, needs_review: 4, missing: 1, extra: 1
});

const flags = Object.fromEntries(result.items.map(item => [item.shot_id, [...item.flags]]));
assert.deepEqual(flags, {
  A010: [],
  A020: ['OLDER_REVISION', 'LENGTH_DIFFERENCE', 'REVIEW_UNCONFIRMED'],
  A030: ['MISSING_DELIVERY'],
  A040: [],
  A050: ['DIFFERENT_REVISION', 'FPS_DIFFERENCE', 'SIZE_DIFFERENCE'],
  A060: ['EXTRA_DELIVERY']
});

const answer = guide.match(/\*\*(\d+) metadata-matched rows\*\*[\s\S]*?\*\*(\d+) rows needing review\*\*[\s\S]*?\*\*(\d+) missing expected row\*\*[\s\S]*?\*\*(\d+) extra delivered row\*\*/);
assert.ok(answer, 'published prose contains the four answer-key totals');
assert.deepEqual(answer.slice(1).map(Number), [2, 4, 1, 1]);

const exported = core.csv(result);
const outputRows = exported.trim().split(/\r?\n/);
assert.equal(outputRows.length, 7, 'CSV report has a header and six distinct shot codes');
assert.ok(outputRows.some(row => row.includes('A020,3,2,pending,OLDER_REVISION|LENGTH_DIFFERENCE|REVIEW_UNCONFIRMED')));
assert.ok(outputRows.some(row => row.includes('A030,1,,,MISSING_DELIVERY')));

const fail = (fn, fragment) => assert.throws(fn, error => error.message.includes(fragment));
fail(() => core.parseDelimited(csvBlocks[0].replace('shot_id,revision,fps', 'revision,shot_id,fps'), 'expected'), 'header must be exactly');
fail(() => core.parseDelimited(csvBlocks[0] + '\nA010,2,24,1920,1080,96', 'expected'), 'Duplicate shot ID');
fail(() => core.parseDelimited(csvBlocks[0].replace('A010,2', 'a010,2'), 'expected'), 'shot_id must');
fail(() => core.parseDelimited(csvBlocks[0].replace('A010,2,24', 'A010,2,12'), 'expected'), '.fps must');
fail(() => core.parseDelimited(csvBlocks[0].replace('A010,2,24,1920', 'A010,2,24,1920x'), 'expected'), 'width must');
fail(() => core.parseDelimited(csvBlocks[1].replace('A010,2,24,1920,1080,96,approved', 'A010,2,24,1920,1080,96,signed'), 'delivered'), '.review_status must');

console.log('PASS: published guide and downloadable fixtures match the v1 engine (2/4/1/1; 6 exact shot flag sets; CSV export; 6 invalid inputs rejected).');
