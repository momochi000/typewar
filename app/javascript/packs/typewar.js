import GameMain from './typewar/game_main'
require("expose-loader?$!expose-loader?jQuery!jquery");
require("expose-loader?_!lodash");

window.onload = (evt) => {
  var $game_container, game_options;

  $game_container = $("[data-typewar-container]");
  if($game_container.length != 1){ return; }
  game_options = $game_container.data();
  new GameMain($game_container[0], game_options);
};
