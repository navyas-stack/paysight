class EmployeeSeeder
  BATCH_SIZE = 1_000
  TOTAL = 10_000

  def call
    raise "Seeding is not allowed in production" if Rails.env.production?

    first_names = read_lines("first_names.txt")
    last_names = read_lines("last_names.txt")
    countries = read_json("countries.json")
    job_titles = read_json("job_titles.json")

    country_names = countries.map { |c| c["name"] }
    currency_map = countries.each_with_object({}) { |c, h| h[c["name"]] = c["currency"] }
    now = Time.current

    ActiveRecord::Base.transaction do
      Employee.delete_all

      TOTAL.times.each_slice(BATCH_SIZE) do |batch|
        records = batch.map do |i|
          country = country_names[i % country_names.size]

          {
            full_name: "#{first_names[i % first_names.size]} #{last_names[i % last_names.size]}",
            email: "employee_#{i}@paysight.com",
            job_title: job_titles[(i / country_names.size) % job_titles.size],
            country: country,
            salary: rand(30_000..250_000).round(2),
            currency: currency_map[country],
            employment_status: "active",
            date_of_joining: Date.today - rand(1..1825),
            created_at: now,
            updated_at: now
          }
        end

        Employee.insert_all(records)
      end
    end
  end

  private

  def read_lines(filename)
    File.readlines(Rails.root.join("db/data/fixtures", filename)).map(&:strip)
  end

  def read_json(filename)
    JSON.parse(File.read(Rails.root.join("db/data/fixtures", filename)))
  end
end
