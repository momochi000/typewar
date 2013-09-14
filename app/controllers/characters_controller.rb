class CharactersController < ApplicationController
  before_filter :load_player, :only => [:show, :update]
  def create
  end

  def index
    p "DEBUG: CharactersController#index"
    # Grab and return a random npc/monster

    render :json => Character.all.sample.to_json
  end

  def show
    render :json => @player_char.char_sheet
  end

  def update
    p "DEBUG: CharactersController#update"
    ap params: params
    ap pc: @player_char

  end

  private
  def load_player
    @player_char = PlayerCharacter.find(params[:id])   
  end
end
