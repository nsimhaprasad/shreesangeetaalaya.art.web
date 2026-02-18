class CreateBatchEnrollments < ActiveRecord::Migration[7.2]
  def change
    create_table :batch_enrollments do |t|
      t.references :batch, null: false, foreign_key: true
      t.references :student, null: false, foreign_key: true
      t.date :enrollment_date
      t.string :status

      t.timestamps
    end

    add_index :batch_enrollments, [:batch_id, :student_id], unique: true
  end
end
