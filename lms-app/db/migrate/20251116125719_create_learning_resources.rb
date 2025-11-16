class CreateLearningResources < ActiveRecord::Migration[7.2]
  def change
    create_table :learning_resources do |t|
      t.string :title
      t.text :description
      t.string :resource_type
      t.string :resource_url
      t.bigint :uploaded_by

      t.timestamps
    end

    add_index :learning_resources, :uploaded_by
    add_foreign_key :learning_resources, :users, column: :uploaded_by
  end
end
