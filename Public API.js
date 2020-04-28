/**
 * @OnlyCurrentDoc
 */
var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

/** @TODO
 * Add n rounds, according to a specific ranking. Ranking for creating rounds are:
 * 1st round:   Series ranking. Can be regional, national or international
 * 2nd round:   1st round ranking
 * 3rd round:   Sum of previous rounds ranking
 * next rounds: same
 *
 * Rule for creating qualification groups is as follow:
 * Riders are separated in groups according to their ranking. For example, for 16 riders, 4 groups of 4.
 * The riders's first group will be red
 * The riders's second group will be yellow
 * The riders's third group will be green
 * The riders's fourth group will be blue
 * Each rider into each group is randomized. Then, we dispatch each rider into the qualification groups
 * 
 * @param nRounds @Optional The number of rounds to be added. If param not given, will be 1
 * @return .
 * @customfunction
 */
function SX_AddRounds(nRounds){
  if (!nRounds) nRounds = 1;
  if (isQualificationFinished()){
    SpreadsheetApp.getUi().alert('Qualifications are finished, you cannot add rounds anymore'); 
    return;
  }
  
  var mode = getQualifRoundMode();
  if (mode != 'Random' && mode != 'Ranking-Single'&& mode != 'Ranking-Double' && mode != 'Ex-aequo'){  
    SpreadsheetApp.getUi().alert('Qualifications mode is not valid'); 
    return;
  }
  
  if (mode == 'Ex-aequo'){
    addCache('qualifPointFactor','0.1');
  }else{
    addCache('qualifPointFactor','1');
  }
  
  SX_sumQualifications();
  addRounds(nRounds);
  
  return;
}

/**
 * 
 *
 * @param 
 * @return .
 * @customfunction
 */
function SX_CreateRounds(){
  if (isQualificationFinished()){
    SpreadsheetApp.getUi().alert('Qualifications are finished, you cannot add rounds anymore'); 
    return;
  }
 
  //find riders
  var riders = findRiders();
  var ridersCount = riders.length;
     
  var rounds = getNbRounds();
  addRounds(rounds);
  
  return "participants:" + (ridersCount);
}


/**
 * To be called when qualifications are over.
 * 1/ Display points for all riders (col E)
 * 2/ Display ranking qualifications
 *
 * @return 
 * @customfunction
 */
function SX_sumQualifications(){
  var ridersList = findRiders();
  sumPoints(ridersList);
  //setQualificationFinished(true);
}

/**
 * To be called when qualification rankings are finalized
 * 3/ Prepare Finals bracket
 *
 * @return 
 * @customfunction
 */
function SX_prepareFinals(){
  var ridersList = findRiders();
  SX_sumQualifications();
  prepareFinals(ridersList);
  setQualificationFinished(true);
}

/**
 * Reset sheet !
 * Display a dialog box with a message and "Yes" and "No" buttons. The user can also close the dialog by clicking the close button in its title bar.
 * Reset Points, Qualif ranking, Final Ranking, qualifications and finals rounds
 * @customfunction
 */
function SX_Reset(){
  if (!isDebugMode()){
    var ui = SpreadsheetApp.getUi();
    var response = ui.alert('Confirm Reset', 'You are about to fully reset qualifications and finals rounds.\nAre you sure you want to continue?', ui.ButtonSet.YES_NO);
  }
  // Process the user's response.
  if (isDebugMode() || response == ui.Button.YES) {
    // reset qualif rounds & finals
    var range = sheet.getRange(1,QUALIF_RANGE.STARTING_COL,sheet.getLastRow(), sheet.getLastColumn());  
    range.clear();
    
    //reset columns F and G
    range = range.offset(4,-2,sheet.getLastRow(), sheet.getLastColumn());  
    range.clear();
    
    setQualificationFinished(false);
    removeCache('qualifCurrentRound');
    removeCache('nbGroupForARound');
    removeCache('nbRiders');

    
  } else {
    //Do nothing...
  }

  
}

