class CharactersController < ApplicationController
  def create
  end

  def index
    # Grab and return a random npc/monster
    render :json => Character.all.sample.to_backbone
  end

  def show
  end

  def update
    ap params: params
  end
end
