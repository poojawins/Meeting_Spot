class CreateMapsTable < ActiveRecord::Migration
  def change
    create_table :maps do |t|
      t.string :name
      t.float :middle_ground_lat
      t.float :middle_ground_long

      t.timestamps
    end
  end
end
