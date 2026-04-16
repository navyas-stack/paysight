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
end
