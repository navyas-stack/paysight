module Api
  module V1
    class EmployeesController < ApplicationController
      before_action :set_employee, only: [:show, :update, :destroy]

      def index
        render_resource(Employee.order(:id), key: :employees, paginate: true)
      end

      def show
        render_resource(@employee, key: :employee)
      end

      def create
        employee = Employee.new(employee_params)

        if employee.save
          render_resource(employee, key: :employee, status: :created)
        else
          render_validation_errors(employee.errors.full_messages)
        end
      end

      def update
        if @employee.update(employee_params)
          render_resource(@employee, key: :employee)
        else
          render_validation_errors(@employee.errors.full_messages)
        end
      end

      def destroy
        @employee.destroy
        head :no_content
      end

      private

      def set_employee
        @employee = Employee.find(params[:id])
      end

      def employee_params
        params.require(:employee).permit(
          :full_name, :email, :job_title, :country,
          :salary, :currency, :employment_status, :date_of_joining
        )
      end
    end
  end
end
