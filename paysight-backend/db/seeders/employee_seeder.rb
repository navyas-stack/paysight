class EmployeeSeeder
  BATCH_SIZE = 1_000
  TOTAL = 10_000
  DATA_PATH = Rails.root.join('db/data/fixtures')

  # Salary bands per job title — more realistic than a single range
  SALARY_RANGES = {
    'Engineer' => 60_000..180_000,
    'Designer' => 50_000..150_000,
    'Manager' => 90_000..220_000,
    'Director' => 150_000..300_000,
    'Analyst' => 50_000..140_000,
    'Consultant' => 70_000..180_000,
    'Architect' => 100_000..220_000,
    'Lead' => 90_000..200_000,
    'Intern' => 20_000..60_000,
    'Coordinator' => 40_000..100_000
  }.freeze
  DEFAULT_SALARY_RANGE = 30_000..120_000

  # Seeding is destructive (delete_all) — allowed only in dev/test.
  # Production skip prevents accidental data loss; use migrations for prod data.
  def call
    raise 'Seeding is not allowed in production' if Rails.env.production?

    countries = read_json('countries.json')
    job_titles = read_json('job_titles.json')
    first_names = read_lines('first_names.txt')
    last_names = read_lines('last_names.txt')

    country_names = countries.map { |c| c['name'] }
    currency_map = countries.each_with_object({}) { |c, h| h[c['name']] = c['currency'] }

    # Cycle through every country × job_title pair — every country gets every title
    combo_cycle = country_names.product(job_titles).cycle
    fn_cycle = first_names.cycle
    ln_cycle = last_names.cycle
    now = Time.current

    Rails.logger.info('[EmployeeSeeder] Starting — clearing existing employees')
    Employee.delete_all

    TOTAL.times.each_slice(BATCH_SIZE).with_index do |batch, batch_index|
      ActiveRecord::Base.transaction do
        records = batch.map do |i|
          country, job_title = combo_cycle.next

          {
            full_name: "#{fn_cycle.next} #{ln_cycle.next}",
            email: "employee_#{i}@paysight.com",
            job_title: job_title,
            country: country,
            salary: rand(SALARY_RANGES.fetch(job_title, DEFAULT_SALARY_RANGE)),
            currency: currency_map[country],
            employment_status: 'active',
            date_of_joining: Date.today - rand(1..1825),
            created_at: now,
            updated_at: now
          }
        end

        Employee.insert_all(records)
        Rails.logger.info("[EmployeeSeeder] Inserted batch #{batch_index + 1} (#{records.size} records)")
      end
    end

    Rails.logger.info("[EmployeeSeeder] Done — #{Employee.count} employees seeded")
  end

  private

  def read_lines(filename)
    File.readlines(DATA_PATH.join(filename)).map(&:strip)
  end

  def read_json(filename)
    JSON.parse(File.read(DATA_PATH.join(filename)))
  end
end
