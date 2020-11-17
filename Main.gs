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
  var pending = cs.getRange(11, 7);
  
  var insert_cell = rs.getRange(lr, 2);
  insert_cell.setValue(character);
  insert_cell.offset(0, 2).setValue(genre);
  insert_cell.offset(0, 3).setValue(series);
  pending.copyTo(rs.getRange(lr, 6));
  
}

function checkCharacter(character, data) {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Control Panel");
  
  var active_cell = ss.getActiveCell();
  var lr = data.getLastRow();
  var found = 0
  var seriesList = []
  
  // clear any data validations before getting started
  active_cell.offset(0, 1).clear().clearDataValidations();
  active_cell.offset(0, 2).clear().clearDataValidations();
  
  // get the list of available characters to reject
  var char_list = data.getRange(2, 2, lr - 1).getValues();
  
  // if a character cannot be found, print 'character' is not on the list
  for(i = 0; i < char_list.length; i++)
    if(character == char_list[i][0])
    {
      found++;
      seriesList.push(data.getRange(i + 2, 5).getValue());
    }
  
  if(found == 0)
  {
    active_cell.offset(1, 0).setValue(character + " is not on the list.");
    return
  }
  
  if(found > 1)
  {
    var seriesRule = SpreadsheetApp.newDataValidation().requireValueInList(seriesList).build();
    active_cell.offset(0, 1).setDataValidation(seriesRule);
  }
  
  else
    active_cell.offset(0, 1).setValue(seriesList[0]);

  active_cell.offset(1, 0).setValue(found + " found on the list.");
  
  if(data.getName() == "Main")
  {
    var validationRange = cs.getRange(2, 7, 9);
    var validationRule = SpreadsheetApp.newDataValidation().requireValueInRange(validationRange).build();
    active_cell.offset(0, 2).setDataValidation(validationRule);
  }
  
}

function autoSort(ss)
{
  ss.sort(20, false);
  ss.sort(24, false);
}

function onEdit(){
  
  var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var ms = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Main");
  var rs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Rejected");
  var cs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Control Panel");
  
  var active_cell = ss.getActiveCell();

  if(active_cell.getColumn() == 1 && ss.getSheetName() == "Control Panel" && active_cell.getValue() != "")
  {
    var character = active_cell.getValue();
    switch(active_cell.getRow())
    {
      case 4:
        checkCharacter(character, rs);
        break;
      case 8:
        checkCharacter(character, ms);
        break;
      case 12:
        active_cell.offset(1,0).setValue("Enter the genre [B12] and series [C12].");
        break;
    }
  }
  
  // for adding a character to the main list
  if(active_cell.getRow() == 4 && ss.getSheetName() == "Control Panel")
  {
    var character = cs.getRange(4, 1).getValue();
    var series = cs.getRange(4, 2).getValue();
    
    if(character != "" && series != "")
    {
      addCharacter(character, series);
      cs.getRange(4, 1, 2, 2).clear().clearDataValidations();
    }
  }
  
  // for removing a character from the main list
  if(active_cell.getRow() == 8 && ss.getSheetName() == "Control Panel")
  {
    var character = cs.getRange(8, 1).getValue();
    var series = cs.getRange(8, 2).getValue();
    var reason = cs.getRange(8, 3).getValue();
    
    var number = 0
    for(i = 2; i < 12; i++)
      if(reason == cs.getRange(i, 7).getValue())
      {
        number = i;
        break
      }
    
    if(character != "" && series != "" && number != 0)
    {
      removeCharacter(character, series, number);
      cs.getRange(8, 1, 2, 3).clear().clearDataValidations();
    }
  }
  
  // for creating a character
  if(active_cell.getRow() == 12 && ss.getSheetName() == "Control Panel")
  {
    var character = cs.getRange(12, 1).getValue();
    var genre = cs.getRange(12, 2).getValue();
    var series = cs.getRange(12, 3).getValue();
    
    if(character != "" && genre != "" && series != "")
    {
      createCharacter(character, genre, series);
      cs.getRange(12, 1, 2, 3).clear().clearDataValidations();
    }
  }
}

function debug() {

}
