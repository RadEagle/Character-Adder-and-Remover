function onEdit(){
  
  var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var ms = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Main");
  var rs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Rejected");
  var cs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Control Panel");
  
  var active_cell = ss.getActiveCell();
  var active_row = active_cell.getRow();

  if(active_cell.getColumn() == 1 && ss.getSheetName() == "Control Panel" && active_cell.getValue() != "")
  {
    var character = active_cell.getValue();
    switch(active_row)
    {
      case 4:
        checkCharacter(character, rs, 0);
        break;
      case 8:
        checkCharacter(character, ms, 1);
        break;
      case 12:
        active_cell.offset(1,0).setValue("Enter the genre [B12] and series [C12].");
        break;
      case 16:
        checkCharacter(character, rs, 1);
        break;
    }
  }
  
  // for adding a character to the main list
  if(active_row == 4 && ss.getSheetName() == "Control Panel")
  {
    var character = cs.getRange(active_row, 1).getValue();
    var series = cs.getRange(active_row, 2).getValue();
    
    if(character != "" && series != "")
    {
      addCharacter(character, series);
      cs.getRange(active_row, 1, 2, 2).clear().clearDataValidations();
    }
  }
  
  // for removing a character from the main list
  if(active_row == 8 && ss.getSheetName() == "Control Panel")
  {
    var character = cs.getRange(active_row, 1).getValue();
    var series = cs.getRange(active_row, 2).getValue();
    var reason = cs.getRange(active_row, 3).getValue();
    var reasonLastRow = getReasonsLastRow();
    
    // convert the reason to a number
    var number = 0
    for(i = 3; i <= reasonLastRow; i++)
      if(reason == cs.getRange(i, 7).getValue())
      {
        number = i;
        break;
      }
    
    if(character != "" && series != "" && number != 0)
    {
      removeCharacter(character, series, number);
      cs.getRange(active_row, 1, 2, 3).clear().clearDataValidations();
    }
  }
  
  // for creating a character
  if(active_row == 12 && ss.getSheetName() == "Control Panel")
  {
    var character = cs.getRange(active_row, 1).getValue();
    var genre = cs.getRange(active_row, 2).getValue();
    var series = cs.getRange(active_row, 3).getValue();
    
    if(character != "" && genre != "" && series != "")
    {
      createCharacter(character, genre, series);
      cs.getRange(active_row, 1, 2, 3).clear().clearDataValidations();
    }
  }
  
  // for changing a reason
  if(active_row == 16 && ss.getSheetName() == "Control Panel")
  {
    var character = cs.getRange(active_row, 1).getValue();
    var series = cs.getRange(active_row, 2).getValue();
    var reason = cs.getRange(active_row, 3).getValue();
    var reasonLastRow = getReasonsLastRow();
    
    // convert the reason to a number
    var number = 0
    for(i = 3; i <= reasonLastRow; i++)
      if(reason == cs.getRange(i, 7).getValue())
      {
        number = i;
        break;
      }
    
    if(character != "" && series != "" && number != 0)
    {
      changeReason(character, series, number);
      cs.getRange(active_row, 1, 2, 3).clear().clearDataValidations();
    }
  }
  
  // track total number of character entries
  cs.getRange("I5").setValue(ms.getLastRow() + rs.getLastRow());
  
}
