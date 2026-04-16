Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :employees

      namespace :analytics do
        get "salary_stats", to: "salary#stats_by_country"
      end
    end
  end
end
