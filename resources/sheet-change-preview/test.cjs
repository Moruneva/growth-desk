const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const vm = require("node:vm");
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(__dirname + "/Core.gs","utf8"),context);
const compare = context.analyzeSheetChange;
const before = [["SKU","Price","Title"],["A", "10", "Tea"],["B","20","Book"]];
test("normal changes and conservative blank warning",()=>{
  const r=compare(before,[["SKU","Price","Title"],["A","","Tea"],["C","30","Cup"]],"SKU");
  assert.equal(r.summary.byKind.POSSIBLE_CLEAR,1);
  assert.equal(r.summary.byKind.ROW_MISSING_IN_PROPOSAL,1);
  assert.equal(r.summary.byKind.ROW_NEW_IN_PROPOSAL,1);
  assert.equal(r.findings.find(f=>f.kind==="POSSIBLE_CLEAR").beforeRow,2);
});
test("original and proposed row sorting does not change key matching",()=>{
  const r=compare(before,[["SKU","Price","Title"],["B","20","Book"],["A","10","Tea"]],"SKU");
  assert.equal(r.summary.findings,0);
});
test("missing keys and duplicates are reported, never guessed",()=>{
  const r=compare([["SKU","Qty"],["A","1"],["A","2"],["","3"]],[["SKU","Qty"],["A","4"],["B","5"]],"SKU");
  assert.equal(r.summary.byKind.DUPLICATE_KEY,1);
  assert.equal(r.summary.byKind.MISSING_KEY,1);
  assert.equal(r.summary.byKind.ROW_NEW_IN_PROPOSAL,1);
  assert.equal(r.summary.byKind.VALUE_CHANGED||0,0);
});
test("column changes do not imply deletion",()=>{
  const r=compare([["SKU","Old"],["A","7"]],[["SKU","New"],["A","8"]],"SKU");
  assert.equal(r.summary.byKind.COLUMN_MISSING_IN_PROPOSAL,1);
  assert.equal(r.summary.byKind.NEW_COLUMN_IN_PROPOSAL,1);
});
test("returned findings exclude raw row values and identifiers",()=>{
  const r=compare([["SKU","Email"],["secret-id","private@example.test"]],[["SKU","Email"],["secret-id","other@example.test"]],"SKU");
  assert.equal(r.summary.byKind.VALUE_CHANGED,1);
  assert.doesNotMatch(JSON.stringify(r),/secret-id|private@example|other@example/);
});
test("fail closed on invalid key, duplicate headers, and oversized input",()=>{
  assert.throws(()=>compare(before,before,"Not a column"),/Key column/);
  assert.throws(()=>compare([["SKU","SKU"],["A","X"]],before,"SKU"),/unique/);
  assert.throws(()=>compare(Array.from({length:502},()=>["X","Y"]),before,"X"),/500/);
});
test("empty and unchanged values handled distinctly",()=>{
  const r=compare([["SKU","Price"],["A",""],["B","20"]],[["SKU","Price"],["A","25"],["B","22"]],"SKU");
  assert.equal(r.summary.byKind.FIELD_FILLED,1);
  assert.equal(r.summary.byKind.VALUE_CHANGED,1);
});

test("duplicate-key findings identify every affected row without exposing identifiers",()=>{
  const r=compare([["SKU","Qty"],["secret-key","1"],["secret-key","2"]],[["SKU","Qty"],["secret-key","1"],["secret-key","3"]],"SKU");
  const duplicate=r.findings.find(x=>x.kind==="DUPLICATE_KEY");
  assert.ok(duplicate);
  assert.match(duplicate.note,/Original rows 2, 3/);
  assert.match(duplicate.note,/Proposed rows 2, 3/);
  assert.doesNotMatch(JSON.stringify(r),/secret-key/);
});
