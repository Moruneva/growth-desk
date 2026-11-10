/* Moruneva Sheet Change Preview v0.1 — browser/Apps Script compatible, pure analysis. */
function analyzeSheetChange(beforeRows, proposedRows, keyHeader) {
  "use strict";
  if (!Array.isArray(beforeRows) || !Array.isArray(proposedRows)) throw new Error("Both tab values must be arrays.");
  if (beforeRows.length < 2 || proposedRows.length < 2) throw new Error("Both tabs need a header and one data row.");
  if (beforeRows.length > 501 || proposedRows.length > 501) throw new Error("Limit: 500 data rows per tab.");
  const width = rows => Math.max(...rows.map(row => Array.isArray(row) ? row.length : 0));
  if (width(beforeRows) > 32 || width(proposedRows) > 32) throw new Error("Limit: 32 columns per tab.");
  if (typeof keyHeader !== "string" || !keyHeader.trim()) throw new Error("Specify an exact column header as the row key.");
  const key = keyHeader.trim();
  function headers(rows) {
    const names = rows[0].map(x => String(x == null ? "" : x).trim());
    if (names.some(n => !n)) throw new Error("Column headers must not be blank.");
    if (new Set(names).size !== names.length) throw new Error("Column headers must be unique.");
    return names;
  }
  const bh = headers(beforeRows), ph = headers(proposedRows);
  if (!bh.includes(key) || !ph.includes(key)) throw new Error("Key column must exist in both tabs (case-sensitive).");
  const findings = [], categories = {};
  function push(kind, oldRow, newRow, field, note) {
    if (findings.length >= 1500) throw new Error("Too many findings; compare smaller batches.");
    findings.push({kind, beforeRow: oldRow || null, proposedRow: newRow || null, field: field || null, note});
    categories[kind] = (categories[kind] || 0) + 1;
  }
  function index(rows, hs) {
    const map = new Map(), duplicates = new Set(), missing = [];
    const k = hs.indexOf(key);
    rows.slice(1).forEach((row, i) => {
      const number = i + 2;
      const v = String(row[k] == null ? "" : row[k]).trim();
      if (!v) { if (row.some(cell => String(cell == null ? "" : cell).trim() !== "")) missing.push(number); return; }
      if (map.has(v)) duplicates.add(v);
      else map.set(v, {number, values: row});
    });
    return {map, duplicates, missing};
  }
  const b = index(beforeRows, bh), p = index(proposedRows, ph);
  b.missing.forEach(row => push("MISSING_KEY", row, null, key, "Original row cannot be matched."));
  p.missing.forEach(row => push("MISSING_KEY", null, row, key, "Proposed row cannot be matched."));
  const duplicated = new Set([...b.duplicates, ...p.duplicates]);
  for (const k of duplicated) {
    const original = b.map.get(k), proposal = p.map.get(k);
    push("DUPLICATE_KEY", original?.number, proposal?.number, key, "At least one tab repeats this key; do not infer a safe match.");
  }
  for (const field of bh) if (!ph.includes(field)) push("COLUMN_MISSING_IN_PROPOSAL", null, null, field, "Missing column is not proof it will be erased.");
  for (const field of ph) if (!bh.includes(field)) push("NEW_COLUMN_IN_PROPOSAL", null, null, field, "Column exists only in proposed tab.");
  const shared = bh.filter(field => field !== key && ph.includes(field));
  for (const [k, original] of b.map) {
    if (duplicated.has(k)) continue;
    const proposal = p.map.get(k);
    if (!proposal) {
      push("ROW_MISSING_IN_PROPOSAL", original.number, null, null, "Missing row does not mean deletion without a declared import policy.");
      continue;
    }
    for (const field of shared) {
      const oldValue = String(original.values[bh.indexOf(field)] ?? "");
      const newValue = String(proposal.values[ph.indexOf(field)] ?? "");
      if (oldValue === newValue) continue;
      const kind = oldValue && !newValue ? "POSSIBLE_CLEAR" : !oldValue && newValue ? "FIELD_FILLED" : "VALUE_CHANGED";
      push(kind, original.number, proposal.number, field, kind === "POSSIBLE_CLEAR" ? "Proposed display is blank; confirm whether import would clear or ignore this field." : "Displayed values differ; inspect this field before importing.");
    }
  }
  for (const [k, proposal] of p.map) if (!duplicated.has(k) && !b.map.has(k)) {
    push("ROW_NEW_IN_PROPOSAL", null, proposal.number, null, "Row has a new key; do not assume importer will create it.");
  }
  return {
    version: "moruneva.sheet-change-preview.v0.1",
    limits: {dataRowsPerTab:500, columnsPerTab:32},
    scope: "Read-only display-value comparison; not an import simulator, permissions audit, formula evaluator, or deletion forecast.",
    summary: {originalRows:beforeRows.length-1, proposedRows:proposedRows.length-1, findings:findings.length, byKind:categories},
    findings
  };
}
