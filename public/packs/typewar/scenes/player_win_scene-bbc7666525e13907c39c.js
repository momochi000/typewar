!function(e){function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}var t={};n.m=e,n.c=t,n.i=function(e){return e},n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=109)}({109:function(e,n){Typewar.Data.Scenes.PlayerWinScene=Backbone.Model.extend({defaults:{scene_id:"player_win_scene"},initialize:function(){var e=this;Crafty.scene(this.get("scene_id"),function(){e.initBackground()})},initBackground:function(){Crafty.background('#FFF url("assets/Typewar/backgrounds/battle_over_win.png") no-repeat center center')},play:function(){Crafty.scene(this.get("scene_id"))}})}});