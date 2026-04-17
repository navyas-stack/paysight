FactoryBot.define do
  factory :employee do
    full_name { Faker::Name.name }
    email { Faker::Internet.unique.email }
    job_title { 'Software Engineer' }
    country { 'India' }
    salary { 75_000.00 }
    currency { 'USD' }
    employment_status { 'active' }
    date_of_joining { Faker::Date.between(from: 5.years.ago, to: Date.current) }
  end
end
