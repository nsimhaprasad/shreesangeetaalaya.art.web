class CreateBatches < ActiveRecord::Migration[7.2]
  def change
    create_table :batches do |t|
      t.string :name
      t.references :course, null: false, foreign_key: true
      t.references :teacher, null: false, foreign_key: true
      t.string :class_type
      t.string :schedule_day
      t.time :schedule_time
      t.integer :max_students
      t.string :status
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
