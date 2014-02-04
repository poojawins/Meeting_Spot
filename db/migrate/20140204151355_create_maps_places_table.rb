class CreateMapsPlacesTable < ActiveRecord::Migration
  def change
    create_table :map_places do |t|
      t.belongs_to :map
      t.belongs_to :place

      t.timestamps
    end
  end

end
