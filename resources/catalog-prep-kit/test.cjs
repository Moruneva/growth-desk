const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const read = p => fs.readFileSync(path.join(__dirname,p),"utf8");
function csvRows(text) {return text.trim().split(/\r?\n/).map(line => {
  const fields=[];let value="",quoted=false;
  for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'&&quoted&&line[i+1]==='"'){value+='"';i++;continue;}
  if(c==='"'){quoted=!quoted;continue;}if(c===","&&!quoted){fields.push(value);value="";continue;}value+=c;}
  assert.equal(quoted,false);fields.push(value);return fields;
});}
test("CSV fact contract stays stable and uniquely keyed",()=>{
  const t=csvRows(read("product-master-template.csv"))[0],a=csvRows(read("fictional-input.csv"));
  assert.deepEqual(a[0],t);assert.equal(a.length,3);assert.equal(new Set(a.slice(1).map(x=>x[0])).size,a.length-1);
  for(const row of a.slice(1)){assert.equal(row.length,t.length);assert.match(row[0],/^FICT-/);assert.equal(row[7],"NO");}
});
test("drafts preserve human review flags and do not invent permissions",()=>{
 const rows=csvRows(read("fictional-review-output.csv"));assert.equal(rows.length,3);
 assert.equal(rows[1][5],"NEEDS_REVIEW");assert.equal(rows[2][5],"NEEDS_REVIEW");
 assert.match(rows[1][3],/image/i);assert.match(rows[2][3],/dimensions/i);
});
test("skill explicitly blocks automatic publishing and imaginary claims",()=>{
 const s=read("SKILL.md");for(const word of ["NEEDS_MERCHANT_CONFIRMATION","SHOPIFY_IMPORT_READY","Do not infer","human","REVIEW","DRAFT"])assert.ok(s.includes(word),word);
});
test("market sources are first party and import limitations disclosed",()=>{
 const e=read("evidence-and-pivot.md"),m=read("merchant-preflight.md");
 assert.match(e,/wordpress\.org\/support\/topic/);assert.match(e,/willingness-to-pay is \*\*unknown\*\*/);
 assert.match(m,/not an import file/);assert.match(m,/shopify/i);assert.match(m,/woocommerce/i);
});
