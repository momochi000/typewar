const images = {
  'test_bg01': {
    file: "assets/Typewar/backgrounds/Fighting-Game-Background-GIFs-2.gif",
    width: 800,
    height: 336
  }
}

export default class Background {
  constructor() {}
  static getBackground(bg_name){
    return images[bg_name];
  }
}
