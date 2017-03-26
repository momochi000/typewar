class Admin::TextsController < ApplicationController
  http_basic_authenticate_with name: "dhh", password: "secret"
  before_filter :load_text, :only => [:edit, :update]

  def index
    @texts = Text.all
  end

  def new 
    @text = Text.new
  end

  def update
  end

  def create
    Text.create(text_params)
    flash[:success] = "You've created a new Text"
    redirect_to(admin_texts_path)
  end

  def edit
  end

  private

  def load_text
    @text = Text.find(params[:id])
  end

  def text_params
    params.require(:text).permit(:content)
  end
end
