class CreateResourceAssignments < ActiveRecord::Migration[7.2]
  def change
    create_table :resource_assignments do |t|
      t.references :learning_resource, null: false, foreign_key: true
      t.references :assignable, polymorphic: true, null: false
      t.bigint :assigned_by
      t.datetime :assigned_at
      t.text :notes

      t.timestamps
    end

    add_index :resource_assignments, :assigned_by
    add_foreign_key :resource_assignments, :users, column: :assigned_by
  end
end
