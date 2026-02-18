class CreateEmailTemplates < ActiveRecord::Migration[7.2]
  def change
    create_table :email_templates do |t|
      t.string :name, null: false
      t.string :subject, null: false
      t.text :body, null: false
      t.text :description
      t.boolean :active, default: true, null: false

      t.timestamps
    end

    add_index :email_templates, :name, unique: true
    add_index :email_templates, :active
  end
end
