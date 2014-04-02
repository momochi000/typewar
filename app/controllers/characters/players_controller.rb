module Characters
  class PlayersController < ApplicationController
    before_filter :load_player, :only => [:show, :update]
    def create
    end

    def index
      # Grab and return a random player character
      render :json => Character.players.sample.to_backbone
    end

    def show
      render :json => @player_char.to_json
    end

    def update
      ap params: params
      ap pc: @player_char
    end

    private
    def load_player
      @player_char = PlayerCharacter.find(params[:id])
    end
  end
end
