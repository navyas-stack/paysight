class AddIndexesToEmployees < ActiveRecord::Migration[8.0]
  def change
    add_index :employees, :country
    add_index :employees, :job_title
    add_index :employees, %i[country job_title]
    add_index :employees, %i[country job_title salary]
    add_index :employees, :employment_status
  end
end
