require 'rails_helper'

RSpec.describe Employee, type: :model do
  describe 'validations' do
    subject { build(:employee) }

    it { is_expected.to validate_presence_of(:full_name) }
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_presence_of(:job_title) }
    it { is_expected.to validate_presence_of(:country) }
    it { is_expected.to validate_presence_of(:salary) }
    it { is_expected.to validate_presence_of(:employment_status) }

    it { is_expected.to validate_numericality_of(:salary).is_greater_than(0) }
    it { is_expected.to validate_uniqueness_of(:email).case_insensitive }

    it { is_expected.to allow_value('user@example.com').for(:email) }
    it { is_expected.to allow_value('name+tag@domain.co.in').for(:email) }
    it { is_expected.not_to allow_value('not-an-email').for(:email) }
    it { is_expected.not_to allow_value('missing@domain').for(:email) }
    it { is_expected.not_to allow_value('@domain.com').for(:email) }

    it 'defines employment_status as an enum with the expected values' do
      expect(Employee.employment_statuses.keys).to match_array(%w[active inactive terminated])
    end
  end

  describe 'scopes' do
    it '.by_country returns only employees from the given country' do
      create(:employee, country: 'India')
      create(:employee, country: 'USA')
      expect(Employee.by_country('India').pluck(:country)).to all(eq('India'))
    end
  end

  describe 'callbacks' do
    it 'normalizes email to lowercase and strips whitespace before save' do
      employee = create(:employee, email: '  John@Example.COM  ')
      expect(employee.reload.email).to eq('john@example.com')
    end
  end
end
