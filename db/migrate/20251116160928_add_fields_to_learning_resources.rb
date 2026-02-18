class AddFieldsToLearningResources < ActiveRecord::Migration[7.2]
  def change
    add_column :learning_resources, :tags, :text
    add_column :learning_resources, :visibility, :string, default: 'private'
    add_column :learning_resources, :is_youtube, :boolean, default: false
  end
end
