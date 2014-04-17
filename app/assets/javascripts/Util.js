Typewar.Util = (function (){
  var coinToss;

  coinToss = function (){
    return ( (Math.floor(Math.random()*2)) === 1 );
  }
  return {coinToss: coinToss}
})();
