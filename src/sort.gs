function autoSort(ss)
{
  ss.sort(20, false);
  ss.sort(24, false);
}

function sortLists()
{
  var ms = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Main");
  var rs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Rejected");
  
  autoSort(ms);
  autoSort(rs);
}
