class AddZoomToClassSessions < ActiveRecord::Migration[7.2]
  def change
    add_column :class_sessions, :zoom_meeting_id, :string
    add_column :class_sessions, :zoom_join_url, :string
    add_column :class_sessions, :zoom_start_url, :string
    add_column :class_sessions, :zoom_password, :string
    add_column :class_sessions, :is_online, :boolean, default: false
    
    add_index :class_sessions, :zoom_meeting_id
  end
end
