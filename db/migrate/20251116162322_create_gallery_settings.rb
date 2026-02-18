class CreateGallerySettings < ActiveRecord::Migration[7.2]
  def change
    create_table :gallery_settings do |t|
      t.string :google_photos_album_url
      t.string :album_id
      t.boolean :is_enabled, default: false
      t.string :title
      t.text :description
      t.boolean :use_google_photos, default: true

      t.timestamps
    end
  end
end
