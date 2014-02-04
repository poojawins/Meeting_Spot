class CreatePlacesTable < ActiveRecord::Migration
  def change
    create_table :places do |t|
      t.string :name
      t.float :latitude
      t.float :longitude
      t.string :address
      t.string :phone
      t.string :google_places_id
      t.boolean :perma_closed
      t.integer :price_level
      t.float :rating
      t.string :reference
      t.string :google_places_url
      t.string :website
      t.string :types

      t.timestamps
    end
  end
end
