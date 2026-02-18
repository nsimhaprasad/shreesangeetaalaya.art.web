class CreateSmsTemplates < ActiveRecord::Migration[7.2]
  def change
    create_table :sms_templates do |t|
      t.string :name, null: false
      t.text :body, null: false
      t.text :description
      t.boolean :active, default: true, null: false

      t.timestamps
    end

    add_index :sms_templates, :name, unique: true
    add_index :sms_templates, :active
  end
end
