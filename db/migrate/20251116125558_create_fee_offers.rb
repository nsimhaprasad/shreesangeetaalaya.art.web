class CreateFeeOffers < ActiveRecord::Migration[7.2]
  def change
    create_table :fee_offers do |t|
      t.string :name
      t.text :description
      t.string :offer_type
      t.integer :duration_months
      t.decimal :discount_percentage, precision: 5, scale: 2
      t.decimal :discount_amount, precision: 10, scale: 2
      t.string :applicable_to
      t.date :valid_from
      t.date :valid_to
      t.string :status

      t.timestamps
    end

    add_index :fee_offers, :status
  end
end
