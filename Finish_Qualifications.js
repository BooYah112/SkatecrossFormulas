/**
 * @OnlyCurrentDoc
 */
var ridersRange = findRidersInfosRange();

// 1/ Evaluate points and qualif rankings for all riders
// 2/ Sort every rider within his points
// 3/ Display Qualif Points and qualif ranking
function sumPoints(ridersList){
  !ridersList ? ridersList = findRiders():null;
  var rounds = getNbRounds();
  
  for (var i=0; i<ridersList.length; i++){
    ridersList[i].points = 0;  
  }
  
  // 1/ Evaluate points and qualif rankings for all riders
  for (var i=0; i<rounds; i++){
    var range = SKX_findRoundRange(i);
    var nRow = range.getHeight();
    for (var j=2; j<=nRow; j++){
      
      var cell = range.getCell(j,2);
      var name = cell.getValue();
      //Logger.log(cell.getValue());
      
      if (!name) continue;
      var rider = getRiderFromName(ridersList, name);
      if (rider)
        rider.points += range.getCell(j,4).getValue(); 
      //Logger.log("we found the rider !" + rider.name + " " +rider.points);
    }
    
    // 2/ Sort every rider within his points
    ridersList.sort(function(a,b){
      return b.points - a.points;
    });
    
    ridersList.forEach(function(rider,i){
      rider.rankQualif = i+1;
    });
    
    //if ex-aequo: sort them
  }  
  
  // 3/ Display Qualif Points and qualif ranking
  var nRow = ridersRange.getHeight();
  var values = [];
  for (var i=1; i<=nRow; i++){
    //var cell = ridersRange.getCell(i,RIDER_COLUMN.QUALIF_POINTS);
    //var rider = getRiderFromName(ridersList, ridersRange.getCell(i, RIDER_COLUMN.NAME).getValue());
    var rider = ridersList[i-1];
    values.push([rider.licence, rider.club, rider.name, rider.rankFinal,rider.points, rider.rankQualif]);
  }
  var xridersRange = ridersRange.getA1Notation();
  ridersRange.setValues(values);
}

function isQualificationFinished(){
  var sValue = getCache('bQualificationFinished');
  var bValue = sValue === 'true';
  return bValue;
}

function setQualificationFinished(bValue){
  addCache('bQualificationFinished', bValue);
}

