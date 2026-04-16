require "rails_helper"

RSpec.describe SalaryAnalyticsService do
  describe ".stats_by_country" do
    context "with multiple employees" do
      before do
        create(:employee, country: "India", salary: 40_000)
        create(:employee, country: "India", salary: 60_000)
        create(:employee, country: "India", salary: 80_000)
        create(:employee, country: "USA", salary: 120_000)
      end

      it "returns min, max, average, and count scoped to a country" do
        result = described_class.stats_by_country("India")

        expect(result[:count]).to eq(3)
        expect(result[:min]).to eq(40_000.0)
        expect(result[:max]).to eq(80_000.0)
        expect(result[:average]).to be_within(0.01).of(60_000.0)
      end
    end

    context "with a single employee" do
      before { create(:employee, country: "Germany", salary: 55_000) }

      it "returns the same value for min, max, and average" do
        result = described_class.stats_by_country("Germany")

        expect(result[:min]).to eq(result[:max])
        expect(result[:average]).to eq(55_000.0)
        expect(result[:count]).to eq(1)
      end
    end

    context "with no employees in a country" do
      it "returns zero count and nil aggregates" do
        result = described_class.stats_by_country("Antarctica")
        expect(result).to eq(min: nil, max: nil, average: nil, count: 0)
      end
    end

    it "fetches all stats in a single database query" do
      create(:employee, country: "India", salary: 50_000)

      query_count = 0
      counter = lambda { |*, _| query_count += 1 }
      ActiveSupport::Notifications.subscribed(counter, "sql.active_record") do
        described_class.stats_by_country("India")
      end

      expect(query_count).to eq(1)
    end
  end

  describe ".average_by_job_title" do
    before do
      create(:employee, country: "India", job_title: "Engineer", salary: 60_000)
      create(:employee, country: "India", job_title: "Engineer", salary: 80_000)
      create(:employee, country: "India", job_title: "Designer", salary: 50_000)
      create(:employee, country: "USA", job_title: "Engineer", salary: 150_000)
    end

    context "with job_title specified" do
      it "returns average salary for that title in the country" do
        expect(described_class.average_by_job_title("India", "Engineer")).to eq(70_000.0)
      end

      it "returns nil when no employees match" do
        expect(described_class.average_by_job_title("India", "CEO")).to be_nil
      end
    end

    context "without job_title" do
      it "returns all job titles with average salary ordered descending" do
        result = described_class.average_by_job_title("India")

        expect(result.length).to eq(2)
        expect(result.first[:job_title]).to eq("Engineer")
        expect(result.first[:average_salary]).to eq(70_000.0)
      end

      it "returns empty array for country with no employees" do
        expect(described_class.average_by_job_title("Antarctica")).to eq([])
      end
    end
  end
end
