class CreatePayments < ActiveRecord::Migration[7.2]
  def change
    create_table :payments do |t|
      t.references :student, null: false, foreign_key: true
      t.references :batch_enrollment, null: false, foreign_key: true
      t.decimal :amount, precision: 10, scale: 2
      t.date :payment_date
      t.string :payment_method
      t.references :fee_offer, null: true, foreign_key: true
      t.string :transaction_reference
      t.integer :months_covered
      t.integer :classes_covered
      t.text :notes
      t.bigint :recorded_by

      t.timestamps
    end

    add_index :payments, :recorded_by
    add_foreign_key :payments, :users, column: :recorded_by
  end
end
