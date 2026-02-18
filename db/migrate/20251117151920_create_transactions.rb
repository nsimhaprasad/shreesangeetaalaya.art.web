class CreateTransactions < ActiveRecord::Migration[7.2]
  def change
    create_table :transactions do |t|
      t.references :payment, null: false, foreign_key: true
      t.references :student, null: false, foreign_key: true
      t.string :phonepe_transaction_id
      t.string :phonepe_merchant_transaction_id
      t.decimal :amount, precision: 10, scale: 2
      t.string :status # PENDING, COMPLETED, FAILED, REFUNDED
      t.string :payment_mode
      t.string :phonepe_checksum
      t.jsonb :phonepe_response
      t.datetime :completed_at
      t.text :failure_reason
      
      t.timestamps
    end
    
    add_index :transactions, :phonepe_transaction_id
    add_index :transactions, :phonepe_merchant_transaction_id, unique: true
    add_index :transactions, :status
  end
end
