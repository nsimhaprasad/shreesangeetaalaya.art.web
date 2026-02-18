class CreateFeeStructures < ActiveRecord::Migration[7.2]
  def change
    create_table :fee_structures do |t|
      t.references :batch, null: false, foreign_key: true
      t.string :class_type
      t.string :fee_type
      t.decimal :amount, precision: 10, scale: 2
      t.date :effective_from
      t.date :effective_to

      t.timestamps
    end

    add_index :fee_structures, [:batch_id, :effective_from]
  end
end
