Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # You can have the root of your site routed with "root"
  # root 'welcome#index'
  root to: "home#index"

  #resources :characters, :only => [:create, :index, :show, :update]
  resource :characters, :only => [] do
    resources :slimes, :only => [:create, :index, :show, :update], :controller => 'characters/slimes'
    resources :players, :only => [:create, :index, :show, :update], :controller => 'characters/players'
  end
end
