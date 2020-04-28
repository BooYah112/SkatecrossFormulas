/**
 * @OnlyCurrentDoc
 */
function isDebugMode(){
  return false; //@TODO: changer le mode si besoin
}

function getRidersRange(){
  var RIDERS_RANGE = {
    STARTING_ROW : 5,
    STARTING_COL : 2,
  
    ENDING_COL : 6
  };
  
  return RIDERS_RANGE;
}

function getCellRange(){
  var CELL_RANGE = {
    NB_RIDERS_ROW : 3,
    NB_RIDERS_COL : 6,
    
    NB_ROUNDS_ROW : 2,
    NB_ROUNDS_COL : 6,
    
    MAX_RIDERS_PER_GROUP_ROW : 1,
    MAX_RIDERS_PER_GROUP_COL : 6,
    
    QUALIF_ROUNDS_MODE_ROW: 1,
    QUALIF_ROUNDS_MODE_COL: 4
    
  };  
  
  return CELL_RANGE;
}

var QUALIF_RANGE = {
  STARTING_ROW : 5,
  STARTING_COL : 8,
  
  SIZE_ROUND_ROW : 6,
  SIZE_ROUND_COL : 4
};

var QUALIF_COLUMN = {
  COLOR : 0,
  NAME: 1,
  RANK: 2,
  POINTS: 3
};

var FINAL_RANGE = {
  STARTING_ROW : 5,
  STARTING_COL : getLastColQualif() + 2,
  
  SIZE_ROUND_ROW : 6,
  SIZE_ROUND_COL : 4
};

var FINAL_COLUMN = {
  COLOR : 1,
  CLUB: 2,
  NAME: 3,
  RANK: 4
};

/*var RIDER_COLUMN = {
  LICENCE : 2,
  CLUB: 3,
  NAME: 4,
  FINAL_RANK: 5,
  QUALIF_POINTS: 6,
  QUALIF_RANK : 7
};
*/

var COLORS = {
  WHITE: '#FFFFFF',
  RED: '#FF0000',
  YELLOW: '#FFFF00',
  GREEN: '#23FF23',
  BLUE: '#0000FF',
  RANKING: '#FFFF99',
  FINAL_ROUND: '#00ffff',
  DISABLED: '#cccccc',
};

var GENERIC_ORDER = [1,8,5,4,3,6,7,2];
var ROUND_NAME = {
  '1': 'Finals',
  '2': 'Semi-Finals',
  '3': 'Third-Finals',
  '4': 'Quarter-Finals',
  '6': 'Sixth-Finals',
  '8': 'Eight-Finals'
};

// each array represents the number of groups for every round.
// For RO12_17: first round is quarter final, then semi, then final
var ROUND_OF = {
  RO4    : [{
    nbGroup: 1, 
    nbMaxRidersPerGroup: 4
  }],
  RO5_8  : [{
    nbGroup: 2, 
    nbMaxRidersPerGroup: 4
  },{
    nbGroup: 1, 
    nbMaxRidersPerGroup: 4,
    ridersPositions:[{
      title: "Final",
      lastRound : true,
      groups: [
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}]
      ]
    },{
      title: "Small Final",
      lastRound : true,
      groups: [
        [{group:1, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:1, rank:4}]
      ]
    }]
  }],
  RO9_11 : [{
    nbGroup: 3, 
    nbMaxRidersPerGroup: 4
  },{
    nbGroup: 2, 
    nbMaxRidersPerGroup: 3,
    ridersPositions:[{
      title: "Winner Bracket Semi Final",
      groups: [
        [{group:1, rank:1},{group:2, rank:2}, {group:1, rank:2}],
        [{group:3, rank:1},{group:2, rank:1}, {group:3, rank:2}]
      ]
    },{
      title: "Loser Bracket Final",
      lastRound : true,
      groups: [
        [{group:1, rank:3},{group:3, rank:3}, {group:2, rank:3}, {group:2, rank:4}, {group:3, rank:4}]
      ]
    }]
  },{
    nbGroup: 1, 
    nbMaxRidersPerGroup: 4,
    ridersPositions:[{
      title: "Winner Bracket Final",
      lastRound : true,
      groups:[
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}]
      ]
    },{
      title: "Winner Bracket Small Final",
      lastRound : true,
      groups: [
        [{group:2, rank:3},{group:1, rank:3}]
      ]
    }]
  }],
  RO12_13: [{
    nbGroup: 4,
    nbMaxRidersPerGroup: 4
  },{
    nbGroup: 2,
    nbMaxRidersPerGroup: 4,
    ridersPositions:[{
      title: "Winner Bracket Semi Final",
      groups:[ 
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}],
        [{group:4, rank:1},{group:3, rank:1},{group:3, rank:2},{group:4, rank:2}]
      ]
    },{
      title: "Loser Bracket Final",
      lastRound : true,
      groups: [
        [{group:1, rank:3}, {group:4, rank:3}, {group:3, rank:3}, {group:2, rank:3}, {group:2, rank:4}]
      ]
    }]
  },{
    nbGroup: 1,
    nbMaxRidersPerGroup: 4,
    ridersPositions:[{
      title: "Winner Bracket Final",
      lastRound : true,
      groups:[
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}]
      ]
    },{
      title: "Winner Bracket Small Final",
      lastRound : true,
      groups: [
        [{group:1, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:1, rank:4}] 
      ]
    }]
  }],
  RO14_17: [{
    nbGroup: 4,
    nbMaxRidersPerGroup: 4
  },{
    nbGroup: 2,
    nbMaxRidersPerGroup: 4,
    ridersPositions:[{
      title: "Winner Bracket Semi Final",
      groups:[ 
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}],
        [{group:4, rank:1},{group:3, rank:1},{group:3, rank:2},{group:4, rank:2}]
      ]
    },{
      title: "Loser Bracket Semi Final",
      groups: [
        [{group:1, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:1, rank:4}],
        [{group:4, rank:3},{group:3, rank:3},{group:3, rank:4},{group:4, rank:4},{group:1, rank:5}]
      ]
    }]
  },{
    nbGroup: 1,
    nbMaxRidersPerGroup: 4,
    ridersPositions:[{
      title: "Winner Bracket Final",
      lastRound : true,
      groups:[
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}]
      ]
    },{
      title: "Winner Bracket Small Final",
      lastRound : true,
      groups: [
        [{group:1, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:1, rank:4}] 
      ]
    },{
      title: "Loser Bracket Final",
      lastRound : true,
      groups:[
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}]
      ]
    },{
      title: "Loser Bracket Small Final",
      lastRound : true,
      groups: [
        [{group:1, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:1, rank:4}, {group:2, rank:5}]
      ]
    }]
  }],
  RO18_20: [{ 
    nbGroup: 6, 
    nbMaxRidersPerGroup: 4
  },{
    nbGroup: 4, 
    nbMaxRidersPerGroup: 3,
    ridersPositions:[{
      title: "Winner Bracket Quarter Final",
      groups: [
        [{group:1, rank:1},{group:2, rank:2}, {group:1, rank:2}],
        [{group:3, rank:1},{group:2, rank:1}, {group:3, rank:2}],
        [{group:4, rank:1},{group:5, rank:2}, {group:4, rank:2}],
        [{group:6, rank:1},{group:5, rank:1}, {group:6, rank:2}]
      ]},{
      title: "Loser Bracket Semi Final",
      groups: [
        [{group:1, rank:3},{group:3, rank:3}, {group:2, rank:3}, {group:2, rank:4}],
        [{group:6, rank:3},{group:4, rank:3}, {group:5, rank:3}, {group:5, rank:4}]
      ]
    }]
  },{
    nbGroup: 2, 
    nbMaxRidersPerGroup: 4,
    ridersPositions:[{
      title: "Winner Bracket Semi Final",
      groups: [
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}],
        [{group:4, rank:1},{group:3, rank:1},{group:4, rank:2},{group:3, rank:2}]
      ]},{
        title: "Winner Bracket Final : 10 -> 12",
      lastRound : true,
      groups: [
        [{group:2, rank:3},{group:3, rank:3}, {group:4, rank:3}, {group:1, rank:3}]
      ]},{
        title: "Loser Bracket Final: 13 -> 16",
      lastRound : true,
      groups: [
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}]
      ]},{
        title: "Loser Bracket Small Final: 17 -> 20",
      lastRound : true,
      groups: [
        [{group:1, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:1, rank:4}]
      ]}
    ]
  },{
    nbGroup: 1, 
    nbMaxRidersPerGroup: 4,
    ridersPositions:[{
      title: "Winner Bracket Final",
      lastRound : true,
      groups: [
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}]
      ]},{
      title: "Winner Bracket Small Final",
      lastRound : true,
      groups:[
        [{group:1, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:1, rank:4}]
      ]}
    ]
  }],
  RO21_23: [{ 
    nbGroup: 6, 
    nbMaxRidersPerGroup: 4
  },{
    nbGroup: 4, 
    nbMaxRidersPerGroup: 3,
    ridersPositions:[{
      title: "Winner Bracket Quarter Final",
      groups:[
        [{group:1, rank:1},{group:2, rank:2}, {group:1, rank:2}],
        [{group:3, rank:1},{group:2, rank:1}, {group:3, rank:2}],
        [{group:4, rank:1},{group:5, rank:2}, {group:4, rank:2}],
        [{group:6, rank:1},{group:5, rank:1}, {group:6, rank:2}]
      ]},{
      title: "Loser Bracket Third Final",
      groups:[
        [{group:1, rank:3},{group:5, rank:3}, {group:5, rank:4}],
        [{group:6, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:6, rank:4}],
        [{group:4, rank:3},{group:3, rank:3}, {group:3, rank:4}, {group:4, rank:4}]
      ]}
    ]
  },{
    nbGroup: 2, 
    nbMaxRidersPerGroup: 4,
    ridersPositions:[{
      title: "Winner Bracket Semi Final",
      groups:[
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}],
        [{group:4, rank:1},{group:3, rank:1},{group:4, rank:2},{group:3, rank:2}]
      ]},{
        title: "Winner Bracket Final: 9 -> 12",
      lastRound : true,
      groups:[
        [{group:2, rank:3},{group:3, rank:3}, {group:4, rank:3},{group:1, rank:3}],
        []
      ]},{
        title: "Loser Bracket Semi Final: 13-> 18",
      groups: [
        [{group:1, rank:1},{group:3, rank:2}, {group:2, rank:2}],
        [{group:2, rank:1},{group:3, rank:1},{group:1, rank:2}]
      ]},{
      title: "Loser Bracket Final: 19 -> 23",
      lastRound : true,
      groups: [
        [{group:1, rank:3},{group:2, rank:3},{group:3, rank:3},{group:3, rank:4}, {group:2, rank:4}]
      ]}
    ]
  },{
    nbGroup: 1, 
    nbMaxRidersPerGroup: 4,
    ridersPositions:[{
      title: "Winner Bracket Final",
      lastRound : true,
      groups :[
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}]
      ]},{
      title: "Winner Bracket Small Final",
      lastRound : true,
      groups:[
        [{group:1, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:1, rank:4}]
      ]},{
        title: "Winner Bracket Final: 9 -> 12",
        lastRound : true,
        groups: [
          [{group:1, rank:1},{group:1, rank:2}, {group:1, rank:3}, {group:1, rank:4}]
        ]},{
        },{
        title: "Winner Bracket Final: 13->16",
        lastRound : true,
        groups:[
          [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}]
       ]},{
      title: "Rank 17 -> 18",
      lastRound : true,
      groups:[
        [{group:1, rank:3},{group:2, rank:3}]
      ]}
    ]
  }],
  RO24_32: [{
    nbGroup: 8, 
    nbMaxRidersPerGroup: 4
  },{
    nbGroup: 4, 
    nbMaxRidersPerGroup: 4,
    ridersPositions:[{
      title: "Winner Bracket Quarter Final",
      groups:[
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}],
        [{group:4, rank:1},{group:3, rank:1}, {group:3, rank:2}, {group:4, rank:2}],
        [{group:5, rank:1},{group:6, rank:1}, {group:6, rank:2}, {group:5, rank:2}],
        [{group:8, rank:1},{group:7, rank:1}, {group:7, rank:2}, {group:8, rank:2}]
      ]},{
      title: "Loser Bracket Quarter Final",
      groups:[
        [{group:1, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:1, rank:4}],
        [{group:4, rank:3},{group:3, rank:3}, {group:3, rank:4}, {group:4, rank:4}],
        [{group:5, rank:3},{group:6, rank:3}, {group:6, rank:4}, {group:5, rank:4}],
        [{group:8, rank:3},{group:7, rank:3}, {group:7, rank:4}, {group:8, rank:4}]
      ]}
    ]
  },{
    nbGroup: 2, 
    nbMaxRidersPerGroup: 4,
    ridersPositions:[{
      title: "Winner Bracket Semi Final",
      groups : [
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}],
        [{group:4, rank:1},{group:3, rank:1}, {group:3, rank:2}, {group:4, rank:2}]
      ]},{
      title: "Winner Bracket Semi Final 9 -> 16",
      groups : [
        [{group:1, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:1, rank:4}],
        [{group:4, rank:3},{group:3, rank:3}, {group:3, rank:4}, {group:4, rank:4}]
      ]},{
      title: "Loser Bracket Semi Final 17 -> 24",
      groups : [
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}],
        [{group:4, rank:1},{group:3, rank:1}, {group:3, rank:2}, {group:4, rank:2}]
      ]},{
      title: "Loser Bracket Semi Final 25 -> 32",
      groups : [
        [{group:1, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:1, rank:4}],
        [{group:4, rank:3},{group:3, rank:3}, {group:3, rank:4}, {group:4, rank:4}]
      ]}
    ]
  },{
    nbGroup: 1, 
    nbMaxRidersPerGroup: 4,
    ridersPositions:[{
      title:  "Winner Bracket Final",
      lastRound : true,
      groups:[
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}]
      ]},{
      title: "Winner Bracket Small Final",
      lastRound : true,
      groups: [
        [{group:1, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:1, rank:4}]
      ]},{
      title: "Winner Bracket Final: 9->12",
      lastRound : true,
      groups:[
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}]
      ]},{
      title: "Winner Bracket Final: 13->16",
      lastRound : true,
      groups:[
        [{group:1, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:1, rank:4}]
      ]},{
      title:  "Loser Bracket Final 17->20",
      lastRound : true,
      groups:[
        [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}]
      ]},{
      title: "Loser Bracket Small Final 21->24",
      lastRound : true,
      groups: [
        [{group:1, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:1, rank:4}]
      ]},{
        title: "Loser Bracket Final 25->28",
        lastRound : true,
        groups: [
          [{group:1, rank:1},{group:2, rank:1}, {group:2, rank:2}, {group:1, rank:2}]
        ]
      },{
      title: "Loser Bracket Final 29->32",
      lastRound : true,
      groups: [
        [{group:1, rank:3},{group:2, rank:3}, {group:2, rank:4}, {group:1, rank:4}]
      ]}
    ]
  }],
  RO33_40: [{ //@TODO
    nbGroup: 8, 
    nbMaxRidersPerGroup: 5
  },{
    nbGroup: 4, 
    nbMaxRidersPerGroup: 5
  },{
    nbGroup: 2, 
    nbMaxRidersPerGroup: 5
  },{
    nbGroup: 1, 
    nbMaxRidersPerGroup: 5
  }]
};
