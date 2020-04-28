/**
 * @OnlyCurrentDoc
 */
var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
var cache = CacheService.getScriptCache();

/**
 * Find riders from the active spread sheet.
 * Be careful that every call re-initialize table
 *
 * @return JSON Array containing: {"licence", "club", "name", "points", "rankQualif", "rankFinal"} for every rider
 * @customfunction
 */
function findRiders(){
  var range = findRidersInfosRange();
  var xrange = range.getA1Notation();
  var data = range.getValues(); //data is an array of json format: [["Lucas"], ["Max"]]
  Logger.log("Value: %s",data[5]);
  var dataToJson = [];
  
  for (var i=0; i<data.length; i++){
    var name = data[i][2];
    if (name === "" || !name){
      data.splice(i,1);
      i--;
    }
    else{
      dataToJson.push({
        licence: data[i][0],
        club: data[i][1],
        name: data[i][2],
        rankFinal: data[i][3] ? data[i][3] : "",
        points: data[i][4] ? data[i][4] : 0,
        rankQualif: data[i][5] ? data[i][5] : ""
        
      });
    }
  }
  //data is cleaned now with only existing persons
  return dataToJson;
}

/**
* Col A: Licence number
* Col B: Club
* Col C: Name
* Col D: Final Rank
* Col E: Qualif Points
* Col F: Qualif Rank
*
*/
function findRidersInfosRange(){
  var ridersRange = getRidersRange(),
      numRows = getNbRiders();
  
  var range = sheet.getRange(ridersRange.STARTING_ROW,ridersRange.STARTING_COL,numRows,ridersRange.ENDING_COL);
  var xrange = range.getA1Notation();
  return range;
}

/**
* Round #1 is G5:J46
* Round #2 is K5:N46
* etc...
*/
function SKX_findRoundRange(roundNumber) {
  var nbGroups = getQualifNbGroup();
  var roundRow = nbGroups * QUALIF_RANGE.SIZE_ROUND_ROW;
    
  var range = sheet.getRange(QUALIF_RANGE.STARTING_ROW,  QUALIF_RANGE.STARTING_COL+QUALIF_RANGE.SIZE_ROUND_COL*roundNumber, roundRow, QUALIF_RANGE.SIZE_ROUND_COL);
  return range;
}

/**
* Starts from 1st round to last round (final)
* 1/ Find last range for qualification runs
* 2/ First range of finals is last range qualif + 2 columns
*/
function SKX_findFirstRoundFinalsRange(){

  var nbGroup = getFinalNbGroup()[0].nbGroup; 
  var finalsLastRangeRow = nbGroup*FINAL_RANGE.SIZE_ROUND_ROW;
  
  var range = sheet.getRange(FINAL_RANGE.STARTING_ROW, FINAL_RANGE.STARTING_COL, finalsLastRangeRow, FINAL_RANGE.SIZE_ROUND_COL);
  return range;
}

/**
* 
*
*
*/
function findNextRoundFinalsrange(previousRange, nbGroupPerBracket){
  var nextRange = previousRange.offset(0,5, nbGroupPerBracket * FINAL_RANGE.SIZE_ROUND_ROW, previousRange.getWidth());
  return nextRange;
}

function findNbGroup(ridersCount){
  if (!ridersCount) ridersCount = findRiders().length;
  var value = 0;
  var maxRidersPerGroup = getMaxRidersPerGroup();
  if (ridersCount >= 0  && ridersCount <= 4){        // 1 group of 0-4 people
    value = 1;
  }else if (ridersCount >= 5  && ridersCount <= 8){  // 2 groups of 2-4 people
    value = 2;
  }else if (ridersCount >= 9 && ridersCount <= 12){  // 3 groups of 3-4 people
    value = 3;
  }else if (ridersCount >= 13 && ridersCount <= (maxRidersPerGroup == 5 ? 19 : 16)){ // 4 groups of 3-5 people
    value = 4;
  }else if (ridersCount >= (maxRidersPerGroup == 5 ? 20 : 17) && ridersCount <= (maxRidersPerGroup == 5 ? 23 : 20)){ // 5 groups of 4-5 people
    value = 5;
  }else if (ridersCount >= (maxRidersPerGroup == 5 ? 24 : 21) && ridersCount <= (maxRidersPerGroup == 5 ? 27 : 24)){ // 6 groups of 4-5 people
    value = 6;
  }else if (ridersCount >= (maxRidersPerGroup == 5 ? 28 : 25) && ridersCount <= (maxRidersPerGroup == 5 ? 35 : 28)){ // 7 groups of 4-5 people
    value = 7;
  } else if (maxRidersPerGroup == 5 ){ 
    value = 8 //should be enough for 8 groups of 4-5 people : max 40 riders......
  } else if (ridersCount >= 29 && ridersCount <= 32){
    value = 8;
  } else if (ridersCount >= 33 && ridersCount <= 37){
    value = 9; 
  } else value = 10;
  addCache('nbGroupForARound',value);
 return value; 
}

/**
* Should return number of round of we should start with, according to number of riders competing
* work only with riders < 40
* return 1,2,3,4,6,8
* 1: Finals
* 2: Semi finals
* 3: Third finals
* 4: Quarter finals
* 6: Sixth finals
* 8: Height finals
*/
function findFinalsFormat(ridersCount){
  if (!ridersCount) ridersCount = getNbRiders();
  var value = ROUND_OF.RO4;
  if (ridersCount >= 0  && ridersCount <= 4){        // 1 group of 0-4 people
    value = ROUND_OF.RO4;
  }else if (ridersCount >= 5  && ridersCount <= 8){  // 2 groups of 2-4 people
    value = ROUND_OF.RO5_8;
  }else if (ridersCount >= 9 && ridersCount <= 11){  // 3 groups of 3-4 people
    value = ROUND_OF.RO9_11;
  }else if (ridersCount >= 12 && ridersCount <= 13){ // 4 groups of 3-4 people
    value = ROUND_OF.RO12_13;
  }else if (ridersCount >= 14 && ridersCount <= 17){ // 4 groups of 3-4 people
    value = ROUND_OF.RO14_17;
  }else if (ridersCount >= 18 && ridersCount <= 20){ // 6 groups of 3-4 people
    value = ROUND_OF.RO18_20;
  }else if (ridersCount >= 21 && ridersCount <= 23){ // 6 groups of 3-4 people
    value = ROUND_OF.RO21_23;
  }else if (ridersCount >= 24 && ridersCount <= 32){ // 8 groups of 3-5 people
    value = ROUND_OF.RO24_32;
  }else value = ROUND_OF.RO33_40 //should continue
  
  //addCache('nbGroupForFinal',value);
  return value;
}

function getNbRiders(){
  var nbRiders = parseInt(getCache('nbRiders'));
  if (!nbRiders || isNaN(nbRiders)){
    var cellRange = getCellRange();
    nbRiders = sheet.getRange(cellRange.NB_RIDERS_ROW,cellRange.NB_RIDERS_COL,1,1).getValue();
    addCache('nbRiders',nbRiders);
  }
  return nbRiders;
}

function getQualifNbGroup(){
  var nbGroupForARound = parseInt(getCache('nbGroupForARound')) || findNbGroup();
  return nbGroupForARound;
}

function getFinalNbGroup(){
  //var nbGroupForFinal = getCache('nbGroupForFinal');
  //return nbGroupForFinal ? nbGroupForFinal : findFinalsFormat(); 
  return findFinalsFormat();
}

function getMaxRidersPerGroup(){
  var cellRange = getCellRange();
  var maxRiders = sheet.getRange(cellRange.MAX_RIDERS_PER_GROUP_ROW,cellRange.MAX_RIDERS_PER_GROUP_COL,1,1).getValue();
  return maxRiders;
}

function getNbRounds(){
  var cellRange = getCellRange();
  var nbRounds = sheet.getRange(cellRange.NB_ROUNDS_ROW,cellRange.NB_ROUNDS_COL).getValue();
  return nbRounds;
}

function getOriginalNbRounds() {  
  var cellRange = getCellRange();
  var nbRounds = sheet.getRange(cellRange.NB_ROUNDS_ROW,cellRange.NB_ROUNDS_COL).getValue();
  return nbRounds;
}

function getFinalNbRounds(){
  var nbRound = parseInt(getCache('qualifCurrentRound')) || getNbRounds();
  return nbRound;
}

function getQualifRoundMode(){
  var cellRange = getCellRange();
  var mode = sheet.getRange(cellRange.QUALIF_ROUNDS_MODE_ROW,cellRange.QUALIF_ROUNDS_MODE_COL).getValue();
  return mode;
}

function getLastColQualif(){
  // Columns needed for all riders infos: first col of qualif minus 1
  var ridersCol = QUALIF_RANGE.STARTING_COL - 1;
  
  // Columns needed for qualifications: 4*nbRound
  var roundCol = QUALIF_RANGE.SIZE_ROUND_COL;
  var nbRounds = getNbRounds();
  var qualifCol = nbRounds * roundCol;
  
  //total
  var total = ridersCol + qualifCol;
  return total;
}

function getRiderFromName(ridersList, name){
  for (var i=0; i<ridersList.length; i++){
    if (ridersList[i].name === name){
     return ridersList[i]; 
    }
  }
}

function prepareGroups(range, nbGroup, nbRidersPerGroup, isQualif, title, isLastRound){
  var BGRange = [],
      textRange = [],
      borderRange = [],
      titleRange;
  
  //set back to default all range cells
  var mergedRange = range.getMergedRanges();
  for (var i = 0; i < mergedRange.length; i++) {
    mergedRange[i].breakApart();
  }
  range.setFontWeight("normal");
  range.setFontSize(10);
  range.setHorizontalAlignment("left");
  
  //then, do stuff
  titleRange = range.offset(-1,0,1);
  if (isQualif){ 
    titleRange.setValues([['Couleur', 'Nom - Prenom', 'Rank', 'Points']]);
    sheet.setColumnWidth(titleRange.getColumn()+1, 150);
    sheet.setColumnWidth(titleRange.getColumn()+2, 50);
    sheet.setColumnWidth(titleRange.getColumn()+3, 50);
  }else{
    
    titleRange.setValues([['Couleur', 'Club', 'Nom - Prenom', 'Rank']]);
    sheet.setColumnWidth(titleRange.getColumn()+1, 100);
    sheet.setColumnWidth(titleRange.getColumn()+2, 150);
    sheet.setColumnWidth(titleRange.getColumn()+3, 50);
  }
  titleRange.setFontWeight("bold");
  titleRange.setFontSize(10);
  titleRange.setBackground('#cccccc');
  titleRange.setBorder(true, true,true,true,false,false, 'black', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  
  //Title Finals text
  var roundTitleRange = titleRange.offset(-1,0,1);
  roundTitleRange.merge();
  roundTitleRange.setValue(title);
  roundTitleRange.setFontWeight("bold");
  roundTitleRange.setFontSize(isLastRound ? 15 : 12);
  roundTitleRange.setHorizontalAlignment("center");
  var bg = isLastRound ? COLORS.FINAL_ROUND : 'yellow';
  roundTitleRange.setBackground(bg);

  for (var i=0; i<nbGroup; i++){
    //merge first row : Group # row
    titleRange = range.offset(0+i*FINAL_RANGE.SIZE_ROUND_ROW,0,1);
    titleRange.merge();
    titleRange.setFontWeight("bold");
    titleRange.setFontSize(12);
    titleRange.setHorizontalAlignment("center");
    
    
    //Prepare Colors  
    BGRange.push([COLORS.WHITE, COLORS.WHITE,COLORS.WHITE,COLORS.WHITE]);
    BGRange.push([COLORS.RED,   COLORS.WHITE,COLORS.WHITE,COLORS.RANKING]);
    BGRange.push([COLORS.YELLOW,COLORS.WHITE,COLORS.WHITE,COLORS.RANKING]);
    BGRange.push([COLORS.GREEN, COLORS.WHITE,COLORS.WHITE,COLORS.RANKING]);
    if (nbRidersPerGroup > 3) BGRange.push([COLORS.BLUE,  COLORS.WHITE,COLORS.WHITE,COLORS.RANKING]);
    else BGRange.push([COLORS.DISABLED,  COLORS.DISABLED,COLORS.DISABLED,COLORS.DISABLED]);
    if (nbRidersPerGroup > 4) BGRange.push([COLORS.WHITE, COLORS.WHITE,COLORS.WHITE,COLORS.RANKING]);
    else BGRange.push([COLORS.DISABLED, COLORS.DISABLED,COLORS.DISABLED,COLORS.DISABLED]);
  
    //Prepare Text
    textRange.push(['Group #' +(i+1), '', '', '']);
    for (var j=0; j<FINAL_RANGE.SIZE_ROUND_ROW-1; j++){
      textRange.push(['','','','']);
    }
    
    //Prepare Border
    var borderRange = range.offset(i*FINAL_RANGE.SIZE_ROUND_ROW,0,FINAL_RANGE.SIZE_ROUND_ROW);
    borderRange.setBorder(true, true,true,true,false,false, 'black', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
    var titleRange = borderRange.offset(0,0,1);
    titleRange.setBorder(null, null,true,null,null,null, 'black', SpreadsheetApp.BorderStyle.SOLID);
    titleRange.setFontWeight('normal');
    
    //Prepare Font Weight
    var groupCell = titleRange.offset(0,0,1,1);
    groupCell.setFontWeight('bold');
    
     
  }
  //range.setValue("fff");
  var trueRange = range.offset(0,0, BGRange.length, BGRange[0].length);
  trueRange.setBackgrounds(BGRange);
  trueRange.setValues(textRange);
}


function addCache(key,value){
  cache.put(key,value,21600); //21600 is the maximum duration (s) authorized by cache. Equal to 6 hours
}

function removeCache(key){
  cache.remove(key);
}

function getCache(key){
 return cache.get(key); 
}