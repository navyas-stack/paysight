class SalaryAnalyticsService
  def self.stats_by_country(country)
    result = Employee.where(country: country)
      .pick(Arel.sql("MIN(salary), MAX(salary), AVG(salary), COUNT(*)"))

    { min: result[0]&.to_f, max: result[1]&.to_f, average: result[2]&.to_f&.round(2), count: result[3] || 0 }
  end
end
