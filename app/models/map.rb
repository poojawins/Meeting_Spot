class Map < ActiveRecord::Base
  has_many :addresses
  attr_accessor :city
  attr_accessible :name, :middle_ground_lat, :middle_ground_long

end