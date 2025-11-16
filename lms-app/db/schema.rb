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

ActiveRecord::Schema[7.2].define(version: 2025_11_16_162322) do
  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "attendances", force: :cascade do |t|
    t.integer "class_session_id", null: false
    t.integer "student_id", null: false
    t.string "status"
    t.datetime "marked_at"
    t.bigint "marked_by"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["class_session_id", "student_id"], name: "index_attendances_on_class_session_id_and_student_id", unique: true
    t.index ["class_session_id"], name: "index_attendances_on_class_session_id"
    t.index ["marked_by"], name: "index_attendances_on_marked_by"
    t.index ["student_id"], name: "index_attendances_on_student_id"
  end

  create_table "batch_enrollments", force: :cascade do |t|
    t.integer "batch_id", null: false
    t.integer "student_id", null: false
    t.date "enrollment_date"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["batch_id", "student_id"], name: "index_batch_enrollments_on_batch_id_and_student_id", unique: true
    t.index ["batch_id"], name: "index_batch_enrollments_on_batch_id"
    t.index ["student_id"], name: "index_batch_enrollments_on_student_id"
  end

  create_table "batches", force: :cascade do |t|
    t.string "name"
    t.integer "course_id", null: false
    t.integer "teacher_id", null: false
    t.string "class_type"
    t.string "schedule_day"
    t.time "schedule_time"
    t.integer "max_students"
    t.string "status"
    t.date "start_date"
    t.date "end_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id"], name: "index_batches_on_course_id"
    t.index ["teacher_id"], name: "index_batches_on_teacher_id"
  end

  create_table "class_sessions", force: :cascade do |t|
    t.integer "batch_id", null: false
    t.date "class_date"
    t.time "class_time"
    t.integer "duration_minutes", default: 60
    t.string "topic"
    t.text "notes"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["batch_id", "class_date"], name: "index_class_sessions_on_batch_id_and_class_date"
    t.index ["batch_id"], name: "index_class_sessions_on_batch_id"
    t.index ["status"], name: "index_class_sessions_on_status"
  end

  create_table "courses", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "course_type"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "fee_offers", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "offer_type"
    t.integer "duration_months"
    t.decimal "discount_percentage", precision: 5, scale: 2
    t.decimal "discount_amount", precision: 10, scale: 2
    t.string "applicable_to"
    t.date "valid_from"
    t.date "valid_to"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["status"], name: "index_fee_offers_on_status"
  end

  create_table "fee_structures", force: :cascade do |t|
    t.integer "batch_id", null: false
    t.string "class_type"
    t.string "fee_type"
    t.decimal "amount", precision: 10, scale: 2
    t.date "effective_from"
    t.date "effective_to"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["batch_id", "effective_from"], name: "index_fee_structures_on_batch_id_and_effective_from"
    t.index ["batch_id"], name: "index_fee_structures_on_batch_id"
  end

  create_table "gallery_settings", force: :cascade do |t|
    t.string "google_photos_album_url"
    t.string "album_id"
    t.boolean "is_enabled", default: false
    t.string "title"
    t.text "description"
    t.boolean "use_google_photos", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "learning_resources", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.string "resource_type"
    t.string "resource_url"
    t.bigint "uploaded_by"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "tags"
    t.string "visibility", default: "private"
    t.boolean "is_youtube", default: false
    t.index ["uploaded_by"], name: "index_learning_resources_on_uploaded_by"
  end

  create_table "payments", force: :cascade do |t|
    t.integer "student_id", null: false
    t.integer "batch_enrollment_id", null: false
    t.decimal "amount", precision: 10, scale: 2
    t.date "payment_date"
    t.string "payment_method"
    t.integer "fee_offer_id"
    t.string "transaction_reference"
    t.integer "months_covered"
    t.integer "classes_covered"
    t.text "notes"
    t.bigint "recorded_by"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["batch_enrollment_id"], name: "index_payments_on_batch_enrollment_id"
    t.index ["fee_offer_id"], name: "index_payments_on_fee_offer_id"
    t.index ["recorded_by"], name: "index_payments_on_recorded_by"
    t.index ["student_id"], name: "index_payments_on_student_id"
  end

  create_table "resource_assignments", force: :cascade do |t|
    t.integer "learning_resource_id", null: false
    t.string "assignable_type", null: false
    t.integer "assignable_id", null: false
    t.bigint "assigned_by"
    t.datetime "assigned_at"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "due_date"
    t.string "priority"
    t.index ["assignable_type", "assignable_id"], name: "index_resource_assignments_on_assignable"
    t.index ["assigned_by"], name: "index_resource_assignments_on_assigned_by"
    t.index ["learning_resource_id"], name: "index_resource_assignments_on_learning_resource_id"
  end

  create_table "students", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "guardian_name"
    t.string "guardian_phone"
    t.string "guardian_email"
    t.string "emergency_contact"
    t.date "enrollment_date"
    t.string "preferred_class_time"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_students_on_user_id"
  end

  create_table "teachers", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "specialization"
    t.integer "years_of_experience"
    t.string "qualification"
    t.text "bio"
    t.boolean "is_admin", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_teachers_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "role"
    t.string "first_name"
    t.string "last_name"
    t.string "phone"
    t.string "whatsapp"
    t.date "date_of_birth"
    t.text "address"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "attendances", "class_sessions"
  add_foreign_key "attendances", "students"
  add_foreign_key "attendances", "users", column: "marked_by"
  add_foreign_key "batch_enrollments", "batches"
  add_foreign_key "batch_enrollments", "students"
  add_foreign_key "batches", "courses"
  add_foreign_key "batches", "teachers"
  add_foreign_key "class_sessions", "batches"
  add_foreign_key "fee_structures", "batches"
  add_foreign_key "learning_resources", "users", column: "uploaded_by"
  add_foreign_key "payments", "batch_enrollments"
  add_foreign_key "payments", "fee_offers"
  add_foreign_key "payments", "students"
  add_foreign_key "payments", "users", column: "recorded_by"
  add_foreign_key "resource_assignments", "learning_resources"
  add_foreign_key "resource_assignments", "users", column: "assigned_by"
  add_foreign_key "students", "users"
  add_foreign_key "teachers", "users"
end
