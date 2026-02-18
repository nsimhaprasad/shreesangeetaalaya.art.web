class CreateClassSessions < ActiveRecord::Migration[7.2]
  def change
    create_table :class_sessions do |t|
      t.references :batch, null: false, foreign_key: true
      t.date :class_date
      t.time :class_time
      t.integer :duration_minutes, default: 60
      t.string :topic
      t.text :notes
      t.string :status

      t.timestamps
    end

    add_index :class_sessions, [:batch_id, :class_date]
    add_index :class_sessions, :status
  end
end
