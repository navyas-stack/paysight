module Api
  module V1
    module Analytics
      class SalaryController < ApplicationController
        def stats_by_country
          return missing_param("country") if params[:country].blank?

          render_resource(SalaryAnalyticsService.stats_by_country(params[:country]))
        end

        private

        def missing_param(name)
          render_error("#{name} param is required", status: :bad_request)
        end
      end
    end
  end
end
