class CreateEmployees < ActiveRecord::Migration[7.1]
  def change
    create_table :employees do |t|
      t.string :full_name, null: false
      t.string :email, null: false
      t.string :job_title, null: false
      t.string :country, null: false
      t.decimal :salary, precision: 10, scale: 2, null: false
      t.string :currency, default: 'USD'
      t.string :employment_status, default: 'active', null: false
      t.date :date_of_joining

      t.timestamps
    end

    add_index :employees, 'LOWER(email)', unique: true, name: 'index_employees_on_lower_email'
    add_check_constraint :employees, 'salary > 0', name: 'chk_employees_salary_positive'
  end
end
