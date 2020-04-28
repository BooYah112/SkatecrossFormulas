/**
 * @OnlyCurrentDoc
 */
/*
* Find range of first round of finals
* Prepare each group cells to be filled: 
* - Text: Round number, Group, Club, Name, Rank
* - Font Weight
* - Colors: Red, Yello, Green, Blue
* - Borders
* - Corresponding Ranked Rider: 1-8-9-16 for first group, etc
*
*/
function prepareFinals(ridersList){
  if (!ridersList) ridersList = findRiders();
  
  var finalsRange = SKX_findFirstRoundFinalsRange();
  var roundOf = getFinalNbGroup();
 
  prepareFirstRoundFinals(ridersList, finalsRange, roundOf[0].nbGroup);

  var nextRound = ROUND_NAME[roundOf[0].nbGroup];
  var previousRange = finalsRange;
  for (var i=1; nextRound !== 'Finals'; i++){
    var nbGroup = roundOf[i].nbGroup;
    var maxRidersByGroup = roundOf[i].nbMaxRidersPerGroup;
    nextRound = ROUND_NAME[nbGroup];
    var nextRange = findNextRoundFinalsrange(previousRange, nbGroup);
    var roundNumber = Math.pow(2, i-1);
    prepareNextRound({previousRange: previousRange, range: nextRange, nbGroup: nbGroup, roundNumber: roundNumber, maxRidersByGroup:maxRidersByGroup, format: roundOf[i], previousNbGroup:roundOf[i-1].nbGroup});
    previousRange = nextRange;
  }
}

function prepareFirstRoundFinals(ridersList, range, nbGroup){
  nbRidersPerGroup = 5;
  prepareGroups(range, nbGroup, nbRidersPerGroup, false, ROUND_NAME[''+nbGroup]);
  var colorText = [];
  
  var groups = prepareGroupOrder(ridersList, nbGroup);
  
  for (var i=0; i<nbGroup; i++){
    //Prepare Text
    colorText.push(['Group #' +(i+1), '', '', '']);
    for (var j=0; j<5; j++){
      var rider = groups[i][j];
      var rank =  rider ? rider.rankQualif : '';
      var club =  rider ? rider.club : '';
      var name =  rider ? rider.name : '';
      colorText.push([rank,club, name,'']);
    }
     
  }
  range.setValues(colorText);
}

// nbGroup: value is always the TOTAL of groups
// previousRange
// nextRange
// roundNumber
// maxRidersByGroup
// format
function prepareNextRound(params){
 var range = params.range,
     previousRange = params.previousRange,
     nbGroup = params.nbGroup,
     roundNumber = params.roundNumber,
     maxRidersByGroup = params.maxRidersByGroup,
     format = params.format,
     previousNbGroup = params.previousNbGroup;
  
  var brackets = roundNumber * 2;
  var groupsPerBracket = nbGroup;
  
  var fromRank = 0;
  var toRank = 0;
  for (var i=0; i<brackets ;i++){
    if (i / 2 > 0 && i%2 === 0) 
      previousRange = previousRange.offset(previousRange.getHeight()+2,0);
    
    var xprevious = previousRange.getA1Notation();
    var xcurrent = range.getA1Notation();
    //var title = 'Bracket #'+ (i+1) + ' ' + ROUND_NAME[+groupsPerBracket];
    var title = format.ridersPositions[i] ? format.ridersPositions[i].title : undefined;
    if (title) {
      var myBracket = format.ridersPositions[i];
      var nbRidersPerGroup = 0;
      groupsPerBracket = myBracket.groups.length;
      myBracket.groups.forEach(function(mygroup){
        if (mygroup.length > nbRidersPerGroup)
          nbRidersPerGroup = mygroup.length;
      });
      
      var isLastRound = myBracket.lastRound;
      prepareGroups(range, groupsPerBracket, nbRidersPerGroup, false, title, isLastRound);
      
      setFormulas(format, nbGroup, range, i+1, previousRange, previousNbGroup);
      
      
      //Then, set groups title on the left
      var titleRange = range.offset(0,-1,groupsPerBracket*FINAL_RANGE.SIZE_ROUND_ROW,1);
      titleRange.merge();
      titleRange.setBackground('#cccccc');
      titleRange.setHorizontalAlignment("center");
      titleRange.setVerticalAlignment("middle");
      titleRange.setFontWeight("bold");
      //titleRange.setValue('Rank 1 -> '+groupsPerBracket*nbRidersPerGroup );
      var fromRank = toRank +1;
      var toRank = fromRank + groupsPerBracket*nbRidersPerGroup -1;
      titleRange.setValue('Rank '+ fromRank + '-> '+ toRank);
      range = range.offset(groupsPerBracket*FINAL_RANGE.SIZE_ROUND_ROW+2,0);
    }
    else{
     range = range.offset(2,0); 
    }
    
    //range = range.offset(range.getHeight()+2,0);
    
    
  }  
}

function prepareGroupOrder(ridersList, nbGroup){
  var groupList = ridersList.slice();//copy 
  while (groupList.length%nbGroup != 0){
   groupList.push(null); 
  }
  var revert = false;
  //var groupLength = 1
  
  var groups = new Array(nbGroup);
  for (var i=0; i<nbGroup; i++){
    groups[i] = [];
  }
  
  for (var i=0; i<groupList.length ; i++){
   var idx;
    if (revert) idx = nbGroup-1 - i%nbGroup;
    else idx = i%nbGroup;
    groups[idx].push(groupList[i]);
    
    if (i%nbGroup == (groupList.length-1)%nbGroup)
      revert = !revert; 
  }
  
  var orderedGroups = [];
  for (var i=0; i<GENERIC_ORDER.length; i++){
    var idx = GENERIC_ORDER[i] -1;
    if (idx >= groups.length) continue;
    orderedGroups.push(groups[idx]);
  }
  
  return orderedGroups;
}

function setFormulas(format, nbGroup, range, bracket, previousRange, previousNbGroup){
 //Set formulas into Brackets
  if (format.ridersPositions){
    var colorText = [], riderFormulas = [];
    var colorRange = range.offset(0,0,range.getHeight(),1);
    var riderRange = range.offset(0,1,range.getHeight(),2);
    
    var values = previousRange.getValues();
    
    var previousGroupsRange = [], previousGroupsRangeToA1Notation = [];
    for (var i=1; i<=previousNbGroup; i++){
      var previousgroup = getGroupRange(previousRange, i, nbGroup*2);
      //if (!previousgroup) continue;
      previousGroupsRange.push(previousgroup ? previousgroup : null);
      previousGroupsRangeToA1Notation.push(previousgroup ? previousgroup.getA1Notation():null);
    }
    
    var bracketIdx = bracket-1;
    var myBracket = format.ridersPositions[bracketIdx];
    nbGroup = myBracket.groups.length;
    for (var i=0; i<nbGroup; i++){    
      var groupNumber = i+1;
      
      values = previousGroupsRange[i] ? previousGroupsRange[i].getValues() : null;
      
      var previousRankRange = getRankRange(previousGroupsRange[i]);
      values = previousRankRange ? previousRankRange.getValues() : null;     
      values = range.getValues();
      
      
      
      //Prepare Text
      var groupName = colorRange.getCell(colorText.length+1,1).getValue();
      colorText.push([groupName]);
      //riderText.push([groupName,groupName]);
      riderFormulas.push(['='+groupName, '='+groupName]);
      //var bracketIdx = i+(bracket-1)*nbGroup;
     
      var groups = myBracket.groups[i];
      for (var j=0; j<FINAL_RANGE.SIZE_ROUND_ROW-1; j++){
        
        var cell = range.getCell(j+2,1);
        //var position = format.ridersPositions[i+(bracket-1)*nbGroup][j];
        var position = groups[j];
        var group = '', rank = '', value = '', txtBracket = 0;
        var clubRangeA1 = '\"\"', nameRangeA1 = '\"\"';
        if (position){
          // set Color
          txtBracket = Math.floor((bracket-1)/2) + 1;
          group = position.group;
          rank = position.rank;
          //bracket % 2 === 0 ? rank += 2:null; //if Bracket is #2, we are in loser bracket
          value = 'B' + txtBracket + ' | ' + 'G' + group + ' #' + rank;
          
          
          //set rider's club & name formulas
          
          // here, we are looking for Bracket=1 | Group=1 | Rank=1
          // translation:
          // range bracket
          // range group : getGroupRange(range, group, nbGroup)
          // range rank : we are looking for {rank} in getRankRange(range)
                    
          //get Group range
          var groupRange = previousGroupsRange[group-1];
          if (!groupRange)
            continue;
          values = groupRange.getValues();
          //get rank
          var rankRange = getRankRange(groupRange);
          if (isDebugMode())
            rankRange.setValues([[1],[2],[3],[4],[5]]);//if you want to simulate finals results

          //setFormula
          var toA1Notation, formulaName = '', formulaClub = '';
          for (var k=1; k<=5; k++){
            toA1Notation = rankRange.getCell(k,1).getA1Notation();
            var toA1NotationClub = groupRange.getCell(k+1,2).getA1Notation();
            var toA1NotationName = groupRange.getCell(k+1,3).getA1Notation();
            formulaName += 'IF('+toA1Notation+'='+rank+','+toA1NotationName+',';            
            formulaClub += 'IF('+toA1Notation+'='+rank+','+toA1NotationClub+',';            
          }
          formulaName += ')))))';
          formulaClub += ')))))';
          
          
          nameRangeA1 = formulaName;//previousRankRange.offset(0+j,-1,1,1).getA1Notation();
          clubRangeA1 = formulaClub;//previousRankRange.offset(0+j,-2,1,1).getA1Notation();
        }
        
        //riderText.push([club, name]);
        riderFormulas.push(['='+clubRangeA1, '='+nameRangeA1]);
        colorText.push([value]);
        
      }
      
    }
    
    var trueRiderRange = riderRange.offset(0,0, riderFormulas.length, riderFormulas[0].length);
    trueRiderRange.setFormulas(riderFormulas);
    var trueColorRange = colorRange.offset(0,0, colorText.length, colorText[0].length);
    trueColorRange.setValues(colorText); 
  }
  
}

function getGroupRange (range, group, nbGroup){
  for (var i=0; i<nbGroup; i++){
    var rowCell = i*FINAL_RANGE.SIZE_ROUND_ROW +1;
    var groupCell = range.getCell(rowCell,1).getValue();
    if (groupCell === ('Group #'+group)){
     return range.offset( rowCell-1, 0, FINAL_RANGE.SIZE_ROUND_ROW,FINAL_RANGE.SIZE_ROUND_COL);
    }
  }
  return null;
}

function getRankRange (range){
  if (!range) 
    return null;
 return range.offset(1, 3, 5, 1);
}


