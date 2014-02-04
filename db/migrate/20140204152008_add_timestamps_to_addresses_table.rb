class AddTimestampsToAddressesTable < ActiveRecord::Migration
  def change
    add_column :addresses, :created_at, :datetime
    add_column :addresses, :updated_at, :datetime
  end
end
