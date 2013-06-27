Typewar.TextInputManager = (function(namespace, $) {
  var init = function(opts) {
    var $display = $(opts.display);
    var $input = $(opts.input);
    var gameInstance = new namespace.Game($display, $input);

    return gameInstance;
  }

  return {init: init};
})(Typewar, jQuery);
