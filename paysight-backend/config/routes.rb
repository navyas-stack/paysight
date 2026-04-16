Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :employees

      namespace :analytics do
        get "salary_stats", to: "salary#stats_by_country"
        get "salary_by_job_title", to: "salary#average_by_job_title"
      end
    end
  end
end
