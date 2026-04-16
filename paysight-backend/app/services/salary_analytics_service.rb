class SalaryAnalyticsService
  def self.stats_by_country(country)
    result = Employee.where(country: country)
      .pick(Arel.sql("MIN(salary), MAX(salary), AVG(salary), COUNT(*)"))

    { min: result[0]&.to_f, max: result[1]&.to_f, average: result[2]&.to_f&.round(2), count: result[3] || 0 }
  end

  def self.average_by_job_title(country, job_title = nil)
    scope = Employee.where(country: country)

    if job_title.present?
      scope.where(job_title: job_title).average(:salary)&.to_f&.round(2)
    else
      scope.group(:job_title)
        .select("job_title, AVG(salary) as average_salary")
        .order("average_salary DESC")
        .map { |r| { job_title: r.job_title, average_salary: r.average_salary.to_f.round(2) } }
    end
  end

  def self.salary_summary_by_country
    Employee.group(:country)
      .select("country, COUNT(*) as count, AVG(salary) as average_salary")
      .map { |r| { country: r.country, count: r.count, average_salary: r.average_salary.to_f.round(2) } }
  end
end
