/* Bind these three files into a Google Sheets Apps Script project. No external APIs. */
function onOpen(e) {
  SpreadsheetApp.getUi().createMenu("Moruneva · Change Preview")
    .addItem("Compare two tabs", "showChangePreview")
    .addToUi();
}
function onInstall(e) { onOpen(e); }
function showChangePreview() {
  const page = HtmlService.createHtmlOutputFromFile("Sidebar").setTitle("Sheet Change Preview");
  SpreadsheetApp.getUi().showSidebar(page);
}
function getChangePreviewTabs() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets().map(s => s.getName());
}
function runChangePreview(originalName, proposedName, keyHeader) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  if (typeof originalName !== "string" || typeof proposedName !== "string" || originalName === proposedName) {
    throw new Error("Choose two different source tabs.");
  }
  const before = book.getSheetByName(originalName), proposed = book.getSheetByName(proposedName);
  if (!before || !proposed) throw new Error("The selected tab is missing.");
  if (before.getLastRow() > 501 || proposed.getLastRow() > 501 ||
      before.getLastColumn() > 32 || proposed.getLastColumn() > 32) {
    throw new Error("For safety, compare at most 500 data rows and 32 columns per tab.");
  }
  /* Displayed cell values only. Never write into the spreadsheet or send data to a network. */
  return analyzeSheetChange(before.getDataRange().getDisplayValues(),
                            proposed.getDataRange().getDisplayValues(), keyHeader);
}
