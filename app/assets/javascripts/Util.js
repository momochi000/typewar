Typewar.Util = _.extend({}, Typewar.Util, ( function (){
  var coinToss, randomInt, isArray, isObject;

  coinToss = function (){
    return ( (Math.floor(Math.random()*2)) === 1 );
  };

  isArray = function (arg){
    if( Object.prototype.toString.call( arg ) === '[object Array]' ) {
      return true;
    }else{
      return false;
    }
  };

  isObject = function (arg){
    if( Object.prototype.toString.call( arg ) === '[object Object]' ) {
      return true;
    }else{
      return false;
    }
  };

  randomInt = function (start, end){
    if(!start || !end){
      throw "ArgumentError in Typewar.Util.randomInt, start or end value not given";
    }
    return Math.floor(Math.random()*(end+1)) + start;
  };

  return {
    coinToss: coinToss,
    isArray: isArray,
    isObject: isObject,
    randomInt: randomInt
  };
})());
