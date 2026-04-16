module Api
  module V1
    class EmployeesController < ApplicationController
      MAX_PER_PAGE = 100

      def index
        per_page = params[:per_page].present? ? [[params[:per_page].to_i, 1].max, MAX_PER_PAGE].min : 25
        employees = Employee.page(params[:page]).per(per_page)

        render json: {
          employees: employees,
          meta: {
            total_count: employees.total_count,
            total_pages: employees.total_pages,
            current_page: employees.current_page,
            per_page: per_page
          }
        }
      end

      def create
        employee = Employee.new(employee_params)

        if employee.save
          render json: { employee: employee }, status: :created
        else
          render json: { errors: employee.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def employee_params
        params.require(:employee).permit(
          :full_name, :email, :job_title, :country,
          :salary, :currency, :employment_status, :date_of_joining
        )
      end
    end
  end
end
