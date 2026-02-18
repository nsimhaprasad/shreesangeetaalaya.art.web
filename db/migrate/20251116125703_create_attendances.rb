class CreateAttendances < ActiveRecord::Migration[7.2]
  def change
    create_table :attendances do |t|
      t.references :class_session, null: false, foreign_key: true
      t.references :student, null: false, foreign_key: true
      t.string :status
      t.datetime :marked_at
      t.bigint :marked_by
      t.text :notes

      t.timestamps
    end

    add_index :attendances, [:class_session_id, :student_id], unique: true
    add_index :attendances, :marked_by
    add_foreign_key :attendances, :users, column: :marked_by
  end
end
