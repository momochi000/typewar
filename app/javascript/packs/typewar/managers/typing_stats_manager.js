Typewar.Engine.Managers.TypingStatsManager = Backbone.Model.extend({
  defaults: {},

  initialize: function (){ },

  analyze: function (){
    var output;

    // look up all the text fragments
    this._obtainFragments();
    // build up a json of the requisite data
    this._aggregateCompletedFragments();
    // send it to the server
    return this._packageData(this._completed_fragments);
    //output = this._packageData(this._completed_fragments);

    //console.log("================================================================================");
    //console.log("=== DEBUG: Gathering stats on completed text fragments ===");
    //console.log("================================================================================");

    //console.log(output);

    //console.log("********************************************************************************");

    //return output;
  },

  // private
  _aggregateCompletedFragments: function (){
    var self;

    self = this;

    this._completed_fragments = [];
    this._all_fragments.each(function (index){
      if(this.isComplete()){
        self._completed_fragments.push(this);
      }
    });
  },

  _getDataFromFragment: function (text_fragment){
    return {
            start: text_fragment.started_at,
              end: text_fragment.completed_at,
             text: text_fragment.getText(),
      text_length: text_fragment.textLength(),
            typos: text_fragment.errorCount()
    };
  },

  _obtainFragments: function (){
    this._all_fragments = Crafty("TextFragment");
  },

  _packageData: function (text_fragments){
    var self;

    self = this;
    return _.map(this._completed_fragments, function (curr_frag){
      return self._getDataFromFragment(curr_frag);
    });
  }
});
