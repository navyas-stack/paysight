require "rails_helper"

RSpec.describe "Analytics API", type: :request do
  describe "GET /api/v1/analytics/salary_stats" do
    before do
      create(:employee, country: "India", salary: 50_000)
      create(:employee, country: "India", salary: 80_000)
      create(:employee, country: "USA", salary: 120_000)
    end

    it "returns min, max, average, and count for the given country" do
      get "/api/v1/analytics/salary_stats", params: { country: "India" }

      body = JSON.parse(response.body)
      expect(response).to have_http_status(:ok)
      expect(body["min"]).to eq(50_000.0)
      expect(body["max"]).to eq(80_000.0)
      expect(body["average"]).to eq(65_000.0)
      expect(body["count"]).to eq(2)
    end

    it "returns zero count for a country with no employees" do
      get "/api/v1/analytics/salary_stats", params: { country: "Antarctica" }

      body = JSON.parse(response.body)
      expect(body["count"]).to eq(0)
    end

    it "returns 400 when country param is missing" do
      get "/api/v1/analytics/salary_stats"

      expect(response).to have_http_status(:bad_request)
      expect(JSON.parse(response.body)["error"]).to include("country")
    end
  end
end
