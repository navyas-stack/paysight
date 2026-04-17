require_relative 'seeders/employee_seeder'

EmployeeSeeder.new.call
puts "Seeded #{Employee.count} employees"
