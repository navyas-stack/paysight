module Api
  module V1
    class SalaryAnalyticsController < ApplicationController
      CACHE_TTL = 10.minutes

      before_action -> { require_param!(:country) }, only: %i[stats_by_country average_by_job_title]

      def stats_by_country
        result = cached("salary_stats/#{analytics_params[:country]}") do
          SalaryAnalyticsService.stats_by_country(analytics_params[:country])
        end

        render_resource(result)
      end

      def average_by_job_title
        key = "salary_by_job_title/#{analytics_params[:country]}/#{analytics_params[:job_title]}"
        result = cached(key) do
          SalaryAnalyticsService.average_by_job_title(
            analytics_params[:country],
            analytics_params[:job_title]
          )
        end

        render_resource(result)
      end

      def salary_summary_by_country
        result = cached('salary_summary_by_country') do
          SalaryAnalyticsService.salary_summary_by_country
        end

        render_resource(result, key: :countries)
      end

      private

      def analytics_params
        params.permit(:country, :job_title)
      end

      def require_param!(key)
        return if params[key].present?

        render_error("#{key} param is required", status: :bad_request)
      end

      def cached(key, &block)
        Rails.cache.fetch(key, expires_in: CACHE_TTL, &block)
      end
    end
  end
end
