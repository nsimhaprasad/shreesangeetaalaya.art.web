class CreateCourses < ActiveRecord::Migration[7.2]
  def change
    create_table :courses do |t|
      t.string :name
      t.text :description
      t.string :course_type
      t.string :status

      t.timestamps
    end
  end
end
