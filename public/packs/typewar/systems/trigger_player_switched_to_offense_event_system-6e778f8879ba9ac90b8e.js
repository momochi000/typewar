!function(e){function n(r){if(t[r])return t[r].exports;var u=t[r]={i:r,l:!1,exports:{}};return e[r].call(u.exports,u,u.exports,n),u.l=!0,u.exports}var t={};n.m=e,n.c=t,n.i=function(e){return e},n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=85)}({16:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),t.d(n,"CMD_CHANGE_STANCE",function(){return r}),t.d(n,"COMMANDS",function(){return u});var r="change stance",u={tab:r}},2:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),t.d(n,"PLAYER_DEFENDED_ATTACK_EVT",function(){return r}),t.d(n,"PLAYER_SWITCHED_TO_OFFENSE_EVT",function(){return u}),t.d(n,"PLAYER_USED_SKILL_EVT",function(){return _}),t.d(n,"SCENE_TRANSITION_EVT",function(){return o}),t.d(n,"TRAINING_TUTORIAL_COMPLETED_EVT",function(){return i}),t.d(n,"BATTLE_VICTORY_COND",function(){return c}),t.d(n,"BATTLE_DEFEAT_COND",function(){return f}),t.d(n,"SID_TRAINING1",function(){return a}),t.d(n,"SID_TRAINING2",function(){return E}),t.d(n,"SID_TRAINING3",function(){return T}),t.d(n,"SID_BABY_SLIME",function(){return d}),t.d(n,"SID_SLIME_BLAST",function(){return s}),t.d(n,"SID_PROTOTYPE_BATTLE",function(){return l}),t.d(n,"SID_PL_LOSE",function(){return I}),t.d(n,"TRN_FADEOUT",function(){return S}),t.d(n,"TRN_NEXT",function(){return N}),t.d(n,"TRN_LOSE",function(){return A});var r="player_defended_attack",u="player_switched_to_offensive_stance",_="player_used_a_skill",o="scene_transition",i="tutorial_completed",c="victory",f="defeat",a="training_scene_1",E="training_scene_2",T="training_scene_3",d="baby_slime",s="slime_blaster",l="prototype_battle",I="player_lose_scene",S="fadeout",N="next",A="lose"},85:function(e,n,t){"use strict";function r(e){var n,t,r;n=e("BattleInput BattleStance").get(),n.length<1||(t=n[0],r=t.getInputQueue(),0!=r.length&&r.forEach(function(n){n==u.CMD_CHANGE_STANCE&&e.trigger(_.PLAYER_SWITCHED_TO_OFFENSE_EVT)}))}Object.defineProperty(n,"__esModule",{value:!0});var u=t(16),_=t(2);n.triggerPlayerSwitchedToOffenseEventSystem=r}});