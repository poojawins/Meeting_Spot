class Map < ActiveRecord::Base
  attr_accessor :city
  attr_accessible :name, :middle_ground_lat, :middle_ground_long, :city
  has_many :addresses
  has_many :users, :through => :addresses


  accepts_nested_attributes_for :addresses

  def coords(city)
    coords = Geocoder.coordinates(city)
    self.middle_ground_lat = coords[0]
    self.middle_ground_long = coords[1]
  end

  def map_title
    self.name.length == 0 ? "Your Map" : self.name
  end

end