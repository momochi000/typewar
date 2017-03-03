import TypewarMain from './typewar/typewar_main'
require("expose-loader?$!expose-loader?jQuery!jquery");
require("expose-loader?_!lodash");

window.onload = (evt) => {
  var $typewar_container;

  $typewar_container = $("[data-typewar-container]")
  if($typewar_container.length != 1){ return; }
  new TypewarMain($typewar_container[0]);
};
