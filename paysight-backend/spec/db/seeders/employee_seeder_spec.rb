require "rails_helper"
require_relative "../../../db/seeders/employee_seeder"

RSpec.describe EmployeeSeeder do
  describe "#call" do
    it "creates exactly 10,000 employees" do
      expect { described_class.new.call }.to change(Employee, :count).by(10_000)
    end

    it "generates full names from first_names.txt and last_names.txt" do
      described_class.new.call

      employee = Employee.first
      first_names = File.readlines(Rails.root.join("db/data/fixtures/first_names.txt")).map(&:strip)
      last_names = File.readlines(Rails.root.join("db/data/fixtures/last_names.txt")).map(&:strip)

      first, last = employee.full_name.split(" ", 2)
      expect(first_names).to include(first)
      expect(last_names).to include(last)
    end

    it "assigns country-specific currency to each employee" do
      described_class.new.call

      countries = JSON.parse(File.read(Rails.root.join("db/data/fixtures/countries.json")))
      currency_map = countries.each_with_object({}) { |c, h| h[c["name"]] = c["currency"] }

      employee = Employee.first
      expect(employee.currency).to eq(currency_map[employee.country])
    end

    it "assigns job titles from job_titles.json" do
      described_class.new.call

      job_titles = JSON.parse(File.read(Rails.root.join("db/data/fixtures/job_titles.json")))
      expect(job_titles).to include(Employee.first.job_title)
    end

    it "is idempotent — clears existing data before seeding" do
      create(:employee)
      described_class.new.call

      expect(Employee.count).to eq(10_000)
    end

    it "completes within 10 seconds" do
      elapsed = Benchmark.realtime { described_class.new.call }
      expect(elapsed).to be < 10
    end
  end
end
