var global_player, global_player_m;
// TODO: Rename to BattleEntityPC and do the same for npc to keep it consistent
var PCBattleEntity = BaseEntity.extend({
  defaults: { },
  urlRoot: '/characters/players',

  initialize: function (){
    var player;

    player = Crafty.e("2D, DOM, BattleCharacter, BattlePlayer, BattlePlayerZeroAnim, plz_st0, Collision")
    player.attr({ x: 20, y: 180 })
      .battlePlayerZeroAnim()
      .battleCharacter()
      .battlePlayer()
      .collision([0,0],[60,0],[60,120],[0,120]);

    player = this._loadSkills(player);

    if(!this.has('skip_fetch')) { this.getFromServer() };
    this.set('entity', player);

    global_player = player; // FOR DEBUGGING
    global_player_m = this;
    return this;
  },

  deallocate: function (){
    this.getEntity().destroy();
    this.clear();
  },

  getFromServer: function (){
    var self = this;

    this.fetch({
      success: function (model, response){
        console.log("SUCCESSFULLY FETCHED PLAYER FROM SERVER.");
        //console.log(model);
        self.processDataFromServer(response);
      },

      error: function (model, response, options) {
        console.log("ERROR OBTAINING PLAYER DATA FROM SERVER. RESPONSE WAS ==> ");
        console.log(response);
        console.log("model ====> ");
        console.log(model);
      }
    });
  },

  processDataFromServer: function (resp){
    var char_sheet, properties, vocab, stats, name, status;

    vocab = this.get('vocabulary');
    stats = this.get('stats');
    status = this.get('status');
    properties = this.get('properties');
    name = resp.name;

    char_sheet = new Typewar.Models.CharacterSheet({
      name:       name || this.name, 
      status:     status,
      stats:      stats,
      vocabulary: this._generatedVocabulary()
    });

    this.getEntity().char_sheet = char_sheet;
    this.getEntity().updateStatus();
  },

  _loadSkills: function (player_entity){
    player_entity.addComponent("SkillManager");

    skills = player_entity.char_sheet.skills;

    if(!skills){
      skills = { ZeroLightSlash: Typewar.Data.Skills.ZeroLightSlash };
//      skills = {
//        ZeroLightSlash: Typewar.Data.Skills.ZeroLightSlash,
//        ZeroLightSlash: Typewar.Data.Skills.ZeroMedSlash,
//        ZeroLightSlash: Typewar.Data.Skills.ZeroHardSlash,
//        ZeroLightSlash: Typewar.Data.Skills.ZeroUpperSlash,
//      });

    };
    return player_entity.skillManager(skills);
  },

  // This is going to go away, Using it now to test the new vocab structure
  _generatedVocabulary: function (){
    return JSON.parse("[{\"difficulty\":1,\"length\":50,\"text\":\"At vero eos et accusamus et iusto odio dignissimos\"},{\"difficulty\":1,\"length\":60,\"text\":\"ducimus qui blanditiis praesentium voluptatum deleniti atque\"},{\"difficulty\":1,\"length\":102,\"text\":\"corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident ,  similique\"},{\"difficulty\":1,\"length\":59,\"text\":\"sunt in culpa qui officia deserunt mollitia animi ,  id est\"},{\"difficulty\":1,\"length\":24,\"text\":\"laborum et dolorum fuga.\"},{\"difficulty\":1,\"length\":36,\"text\":\"Et harum quidem rerum facilis est et\"},{\"difficulty\":1,\"length\":39,\"text\":\"expedita distinctio. Nam libero tempore\"},{\"difficulty\":1,\"length\":77,\"text\":\",  cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod\"},{\"difficulty\":1,\"length\":14,\"text\":\"maxime placeat\"},{\"difficulty\":1,\"length\":17,\"text\":\"facere possimus ,\"},{\"difficulty\":1,\"length\":86,\"text\":\"omnis voluptas assumenda est ,  omnis dolor repellendus. Temporibus autem quibusdam et\"},{\"difficulty\":1,\"length\":93,\"text\":\"aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint\"},{\"difficulty\":1,\"length\":51,\"text\":\"et molestiae non recusandae. Itaque earum rerum hic\"},{\"difficulty\":1,\"length\":27,\"text\":\"tenetur a sapiente delectus\"},{\"difficulty\":1,\"length\":47,\"text\":\",  ut aut reiciendis voluptatibus maiores alias\"},{\"difficulty\":1,\"length\":57,\"text\":\"consequatur aut perferendis doloribus asperiores repellat\"}]");
  }
});
