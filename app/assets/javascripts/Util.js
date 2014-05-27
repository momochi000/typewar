Typewar.Util = _.extend({}, Typewar.Util, ( function (){
  var coinToss, randomInt;

  coinToss = function (){
    return ( (Math.floor(Math.random()*2)) === 1 );
  };

  randomInt = function (start, end){
    if(!start || !end){
      throw "ArgumentError in Typewar.Util.randomInt, start or end value not given";
    }
    return Math.floor(Math.random()*(end+1)) + start;
  };

  return {
    coinToss: coinToss,
    randomInt: randomInt
  };
})());
