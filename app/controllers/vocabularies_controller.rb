class VocabulariesController < ApplicationController
  def index
    # do some rate limiting
    respond_to do |format|
      format.json do
        render :json => Text.all.sample.words
      end
    end
  end
end
