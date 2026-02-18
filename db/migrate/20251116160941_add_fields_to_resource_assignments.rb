class AddFieldsToResourceAssignments < ActiveRecord::Migration[7.2]
  def change
    add_column :resource_assignments, :due_date, :datetime
    add_column :resource_assignments, :priority, :string
  end
end
