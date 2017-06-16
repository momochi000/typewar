Crafty.c("TWHighlight", {
  init: function (){ this.requires("2D, DOM"); },

  tWHighlight: function (){
    var window_coords;
    window_coords = $(this._element).offset();
    if(this.has("ModeIcon")){ //handle special case of icon
      // The actual element to be highlighted is a child of this and doesn't
      // share it's width or height
      let $icon_element = $(this._element).children().first()

      this._highlightElement = createDomRect(
        window_coords.left, window_coords.top,
        $icon_element.width() * Crafty.viewport._scale,
        $icon_element.height() * Crafty.viewport._scale
      );
    }else{
      this._highlightElement = createDomRect(window_coords.left, window_coords.top, this.w, this.h);
    }
    return this;
  },
  removeTWHighlight: function (){
    $(this._highlightElement).remove();
  }
});

function createDomRect(x, y, w, h){
  var div_string, highlight_style, new_el;

  div_string = '<div class="typewar-entity-highlight"></div>';
  highlight_style = `position: fixed; z-index: 9999999; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px;`;

  new_el = document.createElement('div');
  $(new_el).prop("style", highlight_style);
  $(new_el).addClass("typewar-entity-highlight");
  $("body").prepend(new_el);
  return new_el;
}
