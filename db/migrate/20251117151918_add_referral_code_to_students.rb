class AddReferralCodeToStudents < ActiveRecord::Migration[7.2]
  def change
    add_column :students, :referral_code, :string
    add_index :students, :referral_code, unique: true
  end
end
