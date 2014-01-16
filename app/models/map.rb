class Map < ActiveRecord::Base
  has_many :addresses
  attr_accessor :city
  attr_accessible :name, :middle_ground_lat, :middle_ground_long, :city

  def coords(city)
    coords = Geocoder.coordinates(city)
    self.middle_ground_lat = coords[0]
    self.middle_ground_long = coords[1]
  end

end