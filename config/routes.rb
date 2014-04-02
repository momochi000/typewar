Typewar::Application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'
  root to: "home#index"

  #resources :characters, :only => [:create, :index, :show, :update]
  resource :characters, :only => [] do
    resources :slimes, :only => [:create, :index, :show, :update], :controller => 'characters/slimes'
    resources :players, :only => [:create, :index, :show, :update], :controller => 'characters/players'
  end
end
