class CreateReferrals < ActiveRecord::Migration[7.2]
  def change
    create_table :referrals do |t|
      t.references :referrer, null: false, foreign_key: { to_table: :students }
      t.references :referred_student, null: false, foreign_key: { to_table: :students }
      t.string :referral_code, null: false
      t.string :status, null: false, default: 'pending'
      t.references :qualifying_purchase, null: true, foreign_key: { to_table: :student_purchases }
      t.string :reward_type
      t.decimal :reward_amount, precision: 10, scale: 2
      t.datetime :rewarded_at

      t.timestamps
    end

    add_index :referrals, :referral_code
    add_index :referrals, :status
    add_index :referrals, [:referrer_id, :status]
  end
end
