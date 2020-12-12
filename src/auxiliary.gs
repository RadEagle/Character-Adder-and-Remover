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
  
  // if the character is found, push them to the "found" list
  for(i = 0; i < char_list.length; i++)
    if(character == char_list[i][0])
    {
      found++;
      seriesList.push(data.getRange(i + 2, 5).getValue());
    }
  
  // if a character cannot be found, print 'character' is not on the list
  if(found == 0)
  {
    active_cell.offset(1, 0).setValue(character + " is not on the list.");
    return
  }
  
  // if there is more than one character found, make a form to select the series
  if(found > 1)
  {
    var seriesRule = SpreadsheetApp.newDataValidation().requireValueInList(seriesList).build();
    active_cell.offset(0, 1).setDataValidation(seriesRule);
  }
  
  // otherwise, automatically fill in the series
  else
    active_cell.offset(0, 1).setValue(seriesList[0]);

  // log how many were found in the list
  active_cell.offset(1, 0).setValue(found + " found on the list.");
  
  // if rejecting a character, give a list of possible reasons
  var startRowReasons = 3;
  var colLastRow = getReasonsLastRow();
  
  if(data.getName() == "Main")
  {
    var validationRange = cs.getRange(startRowReasons, colIndexReasons, colLastRow - startRowReasons + 1);
    var validationRule = SpreadsheetApp.newDataValidation().requireValueInRange(validationRange).build();
    active_cell.offset(0, 2).setDataValidation(validationRule);
  }
  
}

function autoSort(ss)
{
  ss.sort(20, false);
  ss.sort(24, false);
}

function getLastRowofColumn(ss, col)
{
  var lr = ss.getLastRow();
  for (i = lr; i > 0; i--)
  {
    var cellValue = ss.getRange(i, col).getValue();
    if (cellValue != '')
      return i;
  }
  
  return 0;
}

function getReasonsLastRow()
{
  var cs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Control Panel");
  
  var firstRowContents = cs.getRange(1, 1, 1, cs.getLastColumn()).getValues();
  var colIndexReasons = firstRowContents[0].indexOf("Reasons") + 1;
  return getLastRowofColumn(cs, colIndexReasons);
}
