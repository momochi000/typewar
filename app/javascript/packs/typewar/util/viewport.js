export function viewportConvert(x, y){
  return [
    (x*Crafty.viewport._scale + Crafty.viewport.x),
    (y*Crafty.viewport._scale + Crafty.viewport.y)
  ];
}
