function addCharacter(character, series) {
  
  var ms = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Main");
  var rs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Rejected");
  var cs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Control Panel");
  
  // grab the contents of the cell and copy them to the main list
  var lr = rs.getLastRow();
  var lc = rs.getLastColumn();
  var char_list = rs.getRange(2, 2, lr - 1).getValues();
  var sel_row = 0;
  var insert_cell = ms.getRange(ms.getLastRow() + 1, 1);
  
  // find the character
  for(i = 0; i < char_list.length; i++)
    if(character == char_list[i][0] && series == rs.getRange(i + 2, 5).getValue())
    {
      sel_row = i + 2
      break;
    }
  
  // add the stars and remove the reasoning
  rs.getRange(sel_row, 6).clear();
  rs.getRange(sel_row, 20).setFontColor('#FFFFFF');
  cs.getRange(1, 9).copyTo(rs.getRange(sel_row, 33));
  rs.getRange(sel_row, 1, 1, lc).copyTo(insert_cell);
  rs.deleteRow(sel_row);
  
  // perform an auto-sort
  autoSort(ms)
  
}

function removeCharacter(character, series, reason) {
  
  var ms = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Main");
  var rs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Rejected");
  var cs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Control Panel");
  
  // grab the contents of the cell and copy them to the rejected list
  var lr = ms.getLastRow();
  var lc = ms.getLastColumn();
  var char_list = ms.getRange(2, 2, lr - 1).getValues();
  var sel_row = 0;
  var insert_cell = rs.getRange(rs.getLastRow() + 1, 1);
  
  // find the character
  for(i = 0; i < char_list.length; i++)
    if(character == char_list[i][0] && series == ms.getRange(i + 2, 5).getValue())
    {
      sel_row = i + 2
      break;
    }
  
  // remove the stars and add the reasoning
  ms.getRange(sel_row, 33).clear();
  ms.getRange(sel_row, 20).setFontColor('#000000');
  cs.getRange(reason, 7).copyTo(ms.getRange(sel_row, 6));
  ms.getRange(sel_row, 1, 1, lc).copyTo(insert_cell);
  ms.deleteRow(sel_row);
  
  // perform an auto-sort
  autoSort(rs);
  
}

function createCharacter(character, genre, series) {
  
  var rs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Rejected");
  var cs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Control Panel");
  
  var lr = rs.getLastRow() + 1;
  var pending = cs.getRange(2, 7);
  
  var insert_cell = rs.getRange(lr, 2);
  insert_cell.setValue(character);
  insert_cell.offset(0, 2).setValue(genre);
  insert_cell.offset(0, 3).setValue(series);
  pending.copyTo(rs.getRange(lr, 6));
  
}

function changeReason(character, series, reason) {
  
  var rs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Rejected");
  var cs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Control Panel");
  
  // grab the contents of the cell
  var lr = rs.getLastRow();
  var char_list = rs.getRange(2, 2, lr - 1).getValues();
  var sel_row = 0;
  
  // find the character
  for(i = 0; i < char_list.length; i++)
    if(character == char_list[i][0] && series == rs.getRange(i + 2, 5).getValue())
    {
      sel_row = i + 2
      break;
    }
  
  // change the reasoning
  cs.getRange(reason, 7).copyTo(rs.getRange(sel_row, 6));
  
}
