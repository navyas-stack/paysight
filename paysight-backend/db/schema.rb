# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_04_16_181710) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "employees", force: :cascade do |t|
    t.string "full_name", null: false
    t.string "email", null: false
    t.string "job_title", null: false
    t.string "country", null: false
    t.decimal "salary", precision: 10, scale: 2, null: false
    t.string "currency", default: "USD"
    t.string "employment_status", default: "active", null: false
    t.date "date_of_joining"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index "lower((email)::text)", name: "index_employees_on_lower_email", unique: true
    t.index ["country", "job_title", "salary"], name: "index_employees_on_country_and_job_title_and_salary"
    t.index ["country", "job_title"], name: "index_employees_on_country_and_job_title"
    t.index ["country"], name: "index_employees_on_country"
    t.index ["employment_status"], name: "index_employees_on_employment_status"
    t.index ["job_title"], name: "index_employees_on_job_title"
    t.check_constraint "salary > 0::numeric", name: "chk_employees_salary_positive"
  end
end
