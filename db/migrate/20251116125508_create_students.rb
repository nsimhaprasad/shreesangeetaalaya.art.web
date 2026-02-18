class CreateStudents < ActiveRecord::Migration[7.2]
  def change
    create_table :students do |t|
      t.references :user, null: false, foreign_key: true
      t.string :guardian_name
      t.string :guardian_phone
      t.string :guardian_email
      t.string :emergency_contact
      t.date :enrollment_date
      t.string :preferred_class_time
      t.text :notes

      t.timestamps
    end
  end
end
