class VocabulariesController < ApplicationController
  def index
    # do some rate limiting
    respond_to do |format|
      format.json do
        render :json => Text.all.sample.generate_library
      end
    end
  end
end
