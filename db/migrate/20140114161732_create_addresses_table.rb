class CreateAddressesTable < ActiveRecord::Migration
  def change
    create_table :addresses do |t|
      t.string :name
      t.string :place
      t.float :latitude
      t.float :longitude
      t.belongs_to :map

      t.timestamp
    end
  end
end
