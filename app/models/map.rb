class Map < ActiveRecord::Base
  attr_accessor :city
  attr_accessible :name, :middle_ground_lat, :middle_ground_long, :city
  has_many :addresses
  has_many :users, :through => :addresses
  has_many :map_places
  has_many :places, :through => :map_places
  accepts_nested_attributes_for :addresses

  def coords(city)
    if city == ""
      city = "New York, NY" #default to NY
    end
    coords = Geocoder.coordinates(city)
    self.middle_ground_lat = coords[0]
    self.middle_ground_long = coords[1]
  end

  def map_title
    self.name == nil || self.name.length == 0  ? "Your Map" : self.name
  end

  def addresses_to_json
    a = self.addresses
    a.to_json(:only => [:latitude, :longitude])
  end

  def address_array
    addy_array = []
    self.addresses.each do |address|
      addy_array << [address.latitude, address.longitude]
    end
    addy_array
  end

end
