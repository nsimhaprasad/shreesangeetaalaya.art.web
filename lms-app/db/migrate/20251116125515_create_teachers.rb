class CreateTeachers < ActiveRecord::Migration[7.2]
  def change
    create_table :teachers do |t|
      t.references :user, null: false, foreign_key: true
      t.string :specialization
      t.integer :years_of_experience
      t.string :qualification
      t.text :bio
      t.boolean :is_admin, default: false

      t.timestamps
    end
  end
end
