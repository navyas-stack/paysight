Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :employees

      scope controller: "salary_analytics" do
        get "analytics/salary_stats", action: :stats_by_country
        get "analytics/salary_by_job_title", action: :average_by_job_title
        get "analytics/salary_summary_by_country", action: :salary_summary_by_country
      end
    end
  end
end
