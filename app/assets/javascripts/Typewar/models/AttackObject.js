/* AttackObject: A simple wrapper object encapsulating and 
 * standardizing attack information for use in combat.
 */
Typewar.Models.AttackObject = (function (_, $){
  var 
    // public methods
    create,
    // private methods
    blankProperties,
    // Instance object
    AttackObj;

  blankProperties = function (){
    return {
      blunt:    0, slashing: 0, piercing: 0, fire:     0,
      earth:    0, water:    0, air:      0, light:    0,
      dark:     0, poison:   0, life:     0, death:    0
    };
  };

  create = function (options){
    var foo;
    console.log("DEBUG: ATTACKOBJ, create called on AttackObj with options =====>");
    console.log(options);
    foo = new AttackObj(options);
    console.log("DEBUG: ATTACKOBJ, attack object should have been created, ====>");
    console.log(foo);
    return foo;
    //return new AttackObj(options);
  };

  AttackObj = function(opts){
    if(!opts.attacker){ throw "Attempting to initialize AttackObject without an attacker" ;}
    if(!opts.target)  { throw "Attempting to initialize AttackObject without a defender" ;}
    this.properties    = opts.properties || blankProperties();
    this.target        = opts.target;
    this.attacker      = opts.attacker;
    this.text_fragment = opts.text_fragment;
  };

  _.extend(AttackObj.prototype, { CLASSNAME: 'AttackObject' });

  return {create: create}
})(_, jQuery);
