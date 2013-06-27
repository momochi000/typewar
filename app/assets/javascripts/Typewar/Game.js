(function(namespace, $, _) {
  namespace.Game = function($display, $input) {
    this.$display = $display;
    this.$input = $input;
  }

  _.extend(namespace.Game.prototype, {
    start: function() {
      this.generateCopy();
      this.updateDisplay();
    },

    generateCopy: function() {
      this.copy = "foo bar baz"
    },

    updateDisplay: function() {
      this.$display.html(this.copy);
    }
  })
})(Typewar, jQuery, _);
