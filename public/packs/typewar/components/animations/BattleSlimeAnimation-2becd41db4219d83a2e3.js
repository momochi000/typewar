!function(n){function A(e){if(t[e])return t[e].exports;var r=t[e]={i:e,l:!1,exports:{}};return n[e].call(r.exports,r,r.exports,A),r.l=!0,r.exports}var t={};A.m=n,A.c=t,A.i=function(n){return n},A.d=function(n,t,e){A.o(n,t)||Object.defineProperty(n,t,{configurable:!1,enumerable:!0,get:e})},A.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return A.d(t,"a",t),t},A.o=function(n,A){return Object.prototype.hasOwnProperty.call(n,A)},A.p="",A(A.s=71)}({5:function(n,A,t){"use strict";Object.defineProperty(A,"__esModule",{value:!0}),t.d(A,"ANIM_READY",function(){return e}),t.d(A,"ANIM_LIGHT_ATTACK",function(){return r}),t.d(A,"ANIM_MED_ATTACK",function(){return _}),t.d(A,"ANIM_HEAVY_ATTACK",function(){return i}),t.d(A,"ANIM_SPECIAL_ATTACK",function(){return I}),t.d(A,"ANIM_GUARD",function(){return u}),t.d(A,"ANIM_DASH",function(){return M}),t.d(A,"ANIM_JUMP",function(){return o}),t.d(A,"ANIM_ENTER",function(){return E}),t.d(A,"ANIM_CHARGE",function(){return N}),t.d(A,"ANIM_HIT",function(){return T});var e="ANIM_READY",r="ANIM_LIGHT_ATTACK",_="ANIM_MED_ATTACK",i="ANIM_HEAVY_ATTACK",I="ANIM_SPECIAL_ATTACK",u="ANIM_GUARD",M="ANIM_DASH",o="ANIM_JUMP",E="ANIM_ENTER",N="ANIM_CHARGE",T="ANIM_HIT"},71:function(n,A,t){"use strict";Object.defineProperty(A,"__esModule",{value:!0});var e=t(5),r={ANIM_READY:"SLIME_READY",ANIM_LIGHT_ATTACK:"SLIME_SLASH",ANIM_MED_ATTACK:"SLIME_SLASH",ANIM_HEAVY_ATTACK:"SLIME_THROW",ANIM_SPECIAL_ATTACK:"SLIME_THROW",ANIM_GUARD:"SLIME_BLOCK",ANIM_DASH:"",ANIM_JUMP:"",ANIM_ENTER:"",ANIM_CHARGE:"",ANIM_HIT:"SLIME_HIT"};Crafty.c("BattleSlimeAnimation",{init:function(){this.requires("SpriteAnimation")},battleSlimeAnimation:function(){var n=this;return this.reel("SLIME_READY",600,0,0,4).reel("SLIME_HIT",420,0,1,7).reel("SLIME_SLASH",500,0,2,7).reel("SLIME_THROW",500,0,4,8).reel("SLIME_BLOCK",270,0,3,7).bind("EnterFrame",function(A){n.isPlaying()||n.playAnim(e.ANIM_READY)}),this},playAnim:function(n){this._playAnim(r[n])},_playAnim:function(n){if(!n)throw new Error("ERROR: No reel id passed to play animation");this.animate(n,0)}})}});