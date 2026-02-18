class CreateStudentPurchases < ActiveRecord::Migration[7.2]
  def change
    create_table :student_purchases do |t|
      t.references :student, null: false, foreign_key: true
      t.references :batch, null: true, foreign_key: true
      t.string :purchase_type, null: false
      t.integer :quantity, null: false, default: 1
      t.decimal :amount, precision: 10, scale: 2, null: false
      t.string :payment_status, null: false, default: 'pending'
      t.string :payment_method
      t.string :transaction_id
      t.text :notes

      t.timestamps
    end

    add_index :student_purchases, [:student_id, :payment_status]
    add_index :student_purchases, :purchase_type
    add_index :student_purchases, :created_at
  end
end
