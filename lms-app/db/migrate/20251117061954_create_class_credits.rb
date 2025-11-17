class CreateClassCredits < ActiveRecord::Migration[7.2]
  def change
    create_table :class_credits do |t|
      t.references :student, null: false, foreign_key: true
      t.references :batch, null: false, foreign_key: true
      t.integer :credits, null: false, default: 0
      t.integer :used_credits, null: false, default: 0
      t.datetime :purchase_date, null: false
      t.datetime :expiry_date
      t.decimal :amount_paid, precision: 10, scale: 2, null: false

      t.timestamps
    end

    add_index :class_credits, [:student_id, :batch_id]
    add_index :class_credits, :expiry_date
  end
end
