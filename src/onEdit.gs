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
    
    // convert the reason to a number
    var number = 0
    for(i = 3; i < getReasonsLastRow(); i++)
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
  
  // track total number of character entries
  cs.getRange("I5").setValue(ms.getLastRow() + rs.getLastRow());
  
}
