/**
 * @OnlyCurrentDoc
 */
var numRows = sheet.getLastRow();

var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

/**
 * Create a single qualification round, suffle riders, and fill the groups
 *
 * @param nbGroupForARound How many groups for a single round
 * @param roundNumber Which round we are building
 * @param riders list of riders
 * @return .
 * @customfunction
 */
function createRound(params) {
  var totalRoundRow = QUALIF_RANGE.SIZE_ROUND_ROW * params.nbGroup;
  
  //var numRows = sheet.getLastRow();
  //range is all concerned cells for a round
  var range = sheet.getRange(QUALIF_RANGE.STARTING_ROW,QUALIF_RANGE.STARTING_COL+(params.round-1)*QUALIF_RANGE.SIZE_ROUND_COL,totalRoundRow, QUALIF_RANGE.SIZE_ROUND_COL);//get all cells from G5:J5, to G.lastRow:J.lastRow.
  var xrange = range.getA1Notation();
  
  prepareRoundQualif(range, params.nbGroup, params.round);
  
  //if riders are not given in param, find them in list !
  if (!params.riders)
    params.riders = findRiders();
  
  //suffle riders
  params.mode = getQualifRoundMode();
  var groups = shuffleRidersInGroups(params);
  //then copy
  //var ridersCopy = riders.slice(0);
   
  //put riders name into each group
  for(var i=0; i<groups.length; i++){
   var ridersGroup = groups[i];
   var groupNumber = i+1;
   var rangeGroup = SKX_getRangeGroup(range, groupNumber);
    SKX_createGroup(rangeGroup, ridersGroup, groupNumber);
  }
  
  //update formula of all points column
  var rangePoints = range.offset(0,QUALIF_COLUMN.POINTS,range.getHeight(),1);
  Logger.log('---------------------------------');
  Logger.log('range of points column: ' + rangePoints.getHeight() + ' ' + rangePoints.getWidth());
  var factor = parseFloat(getCache('qualifPointFactor'));

  rangePoints.setFormulaR1C1("=if(R[0]C[-1]:R[0]C[-1]=1,"+5*factor+",if(R[0]C[-1]:R[0]C[-1]=2,"+3*factor+",if(R[0]C[-1]:R[0]C[-1]=3,"+2*factor+",if(R[0]C[-1]:R[0]C[-1]=4,"+1*factor+",if(R[0]C[-1]:R[0]C[-1]=5,"+0*factor+",)))))");
  
  
  ////////////////////////////////////////////
  //Store point values in ridersList Json.
  //From here, calculate Col E (total points)
  //Then, valuate col F(qualif ranking) corresponding to Points of each rider.
  //if ex-aequo: it is a problem...
  //create 'qualifications finished' button, then sort riders
  //prepare quarter finals...
}
/**
 * Add rounds to current qualifications.
 * @param nRounds @Optional Number of rounds to be added. If param is not given, 1 round id added
 */
function addRounds(nRounds){
  nRounds = nRounds || 1;
  var qualifCurrentRound = parseInt(getCache('qualifCurrentRound'));
  qualifCurrentRound = isNaN(qualifCurrentRound) ?  0 : qualifCurrentRound;
  var nextRound;
  
  for (var i=1; i<=nRounds; i++){
    nextRound = qualifCurrentRound+i;
    createRound({
      nbGroup : getQualifNbGroup(),
      round : nextRound
    });  
  }
  addCache('qualifCurrentRound', nextRound);
  var cellRange = getCellRange();
  sheet.getRange(cellRange.NB_ROUNDS_ROW,cellRange.NB_ROUNDS_COL).setValue(nextRound);
}

/**
 * 
 * @param 
 * @return .
 */
function SKX_createGroup(rangeGroup, ridersGroup, groupNumber){  
  
  //rebootPage();
  
  //Logger.log("myRange is:");
  //Logger.log(rangeGroup.getValues());
  Logger.log('ridersGroup.length: ' + ridersGroup.length);
  var values = [];
  
  values.push(["Group #"+groupNumber,"","",""]);
  for(var i=0; i<QUALIF_RANGE.SIZE_ROUND_ROW-1; i++){  
    if (ridersGroup[i] &&  ridersGroup[i].name){
      if (isDebugMode())
        values.push( [ "", ridersGroup[i].name, i+1,"" ]);
      else 
        values.push( [ "", ridersGroup[i].name, "","" ]);
    } else{
      values.push( [ "", "", "","" ]);
    }
  }
  rangeGroup.setValues(values);
}

/**
 * 
 * @param 
 * @return .
 */
function prepareRoundQualif(range, nbGroup, roundNumber){
  var nbRidersPerGroup = getMaxRidersPerGroup();
  var title = 'Round #' + roundNumber;
  prepareGroups(range, nbGroup, nbRidersPerGroup, true, title);
  var textRange = [];  
  
  for (var i=0; i<nbGroup; i++){
    
    //Prepare Text
    textRange.push(['Group #' +(i+1), '', '', '']);
    for (var j=0; j<5; j++){
      textRange.push(['','','','']);
    }
     
  }
  range.setValues(textRange);
}

/**
 * 
 * @param 
 * @return .
 */
function SKX_getRangeGroup(range, groupNumber){
  var firstRow = (groupNumber-1) * QUALIF_RANGE.SIZE_ROUND_ROW ;//+ 1;
  var lastRow = groupNumber * QUALIF_RANGE.SIZE_ROUND_ROW;
  
  //offset only rows, and take 6 rows out of this range ==> we have all group cells
  range = range.offset(firstRow,0,6);
  
  return range;
}

/** TODO
 * Shuffle riders for qualifications
 * @TODO: Should add some params for suffling
 * 1st round:   Series ranking. Can be regional, national or international
 * 2nd round:   1st round ranking
 * 3rd round:   Sum of previous rounds ranking
 * next rounds: same
 *
 * @return List of groups with shuffled riders according to their score or ranking
 * @customfunction
 */
function shuffleRidersInGroups(params){
  var riderList = params.riders;

  var mode = params.mode;
  var factor = 1;
  if (mode == 'Random'){  
    //add a random value to each rider
    /*for (var i=0; i<riderList.length; i++){
      riderList[i].random = Math.random(); 
    }
    
    //sort every rider within his random value
    riderList.sort(function(a,b){
      return a.random - b.random;
    });*/
    riderList = shuffle(riderList);
    
  } else if (mode == 'Ranking-Single'){
    /* Already sorted
    riderList.sort(function(a,b){
      return a.rankQualif - b.rankQualif;
    });
    */
    
    
  } else if (mode == 'Ranking-Double'){
    factor = 2;
  }
  
  var groups = [];
  
  if (mode == 'Ex-aequo'){
    var ridersCopy = riderList.slice(0);
    for (var i=0; i<params.nbGroup;i++){
      var nbRidersForGroup = Math.ceil(ridersCopy.length / (params.nbGroup - i));
      groups.push(ridersCopy.splice(0,nbRidersForGroup));
    }
  }
  else{ 
    var current = 0;
    while (current < riderList.length){
      var sameLevelRiders = [];
      
      for (var i=0; i<params.nbGroup*factor; i++, current++){
        var rider = riderList[current];
        if (!rider) break;
        
        sameLevelRiders.push(rider);
      }
      
      sameLevelRiders = shuffle(sameLevelRiders);
     
      for (var i=0; i<params.nbGroup*factor; i++){
        groups[i%params.nbGroup] = groups[i%params.nbGroup] || [];
        groups[i%params.nbGroup].push(sameLevelRiders[i]);
      }
    }
  }
  
  return groups;
}

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
function shuffle(array) {
    var counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        var index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}