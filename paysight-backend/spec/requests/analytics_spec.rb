require 'rails_helper'

RSpec.describe 'Analytics API', type: :request do
  let(:body) { JSON.parse(response.body) }

  describe 'GET /api/v1/analytics/salary_stats' do
    before do
      create(:employee, country: 'India', salary: 50_000)
      create(:employee, country: 'India', salary: 80_000)
      create(:employee, country: 'USA', salary: 120_000)
    end

    it 'returns min, max, average, and count for the given country' do
      get '/api/v1/analytics/salary_stats', params: { country: 'India' }

      expect(response).to have_http_status(:ok)
      expect(body['success']).to be(true)
      expect(body['data']['min']).to eq(50_000.0)
      expect(body['data']['max']).to eq(80_000.0)
      expect(body['data']['average']).to eq(65_000.0)
      expect(body['data']['count']).to eq(2)
    end

    it 'returns zero count for a country with no employees' do
      get '/api/v1/analytics/salary_stats', params: { country: 'Antarctica' }

      expect(body['data']['count']).to eq(0)
    end

    it 'returns 400 when country param is missing' do
      get '/api/v1/analytics/salary_stats'

      expect(response).to have_http_status(:bad_request)
      expect(body['success']).to be(false)
      expect(body['error']).to include('country')
    end
  end

  describe 'GET /api/v1/analytics/salary_by_job_title' do
    before do
      create(:employee, country: 'India', job_title: 'Engineer', salary: 60_000)
      create(:employee, country: 'India', job_title: 'Engineer', salary: 80_000)
      create(:employee, country: 'India', job_title: 'Designer', salary: 50_000)
    end

    it 'returns average salary for a specific job title' do
      get '/api/v1/analytics/salary_by_job_title', params: { country: 'India', job_title: 'Engineer' }

      expect(response).to have_http_status(:ok)
      expect(body['data']['average']).to eq(70_000.0)
    end

    it 'returns all titles with averages when job_title is omitted' do
      get '/api/v1/analytics/salary_by_job_title', params: { country: 'India' }

      expect(response).to have_http_status(:ok)
      expect(body['data']['titles'].length).to eq(2)
      expect(body['data']['titles'].first['job_title']).to eq('Engineer')
    end

    it 'returns 400 when country param is missing' do
      get '/api/v1/analytics/salary_by_job_title'

      expect(response).to have_http_status(:bad_request)
    end
  end

  describe 'GET /api/v1/analytics/salary_summary_by_country' do
    it 'returns stats grouped by all countries' do
      create(:employee, country: 'India', salary: 50_000)
      create(:employee, country: 'India', salary: 70_000)
      create(:employee, country: 'USA', salary: 100_000)

      get '/api/v1/analytics/salary_summary_by_country'

      expect(response).to have_http_status(:ok)
      expect(body['data']['countries'].length).to eq(2)

      india = body['data']['countries'].find { |c| c['country'] == 'India' }
      expect(india['count']).to eq(2)
    end

    it 'returns empty array when no employees exist' do
      get '/api/v1/analytics/salary_summary_by_country'

      expect(body['data']['countries']).to eq([])
    end
  end
end
