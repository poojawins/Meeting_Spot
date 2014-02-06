class Place < ActiveRecord::Base
	attr_accessible :name, :latitude, :longitude, :price_level, :rating, :reference, :types
  has_many :map_places
  has_many :maps, :through => :map_places

	def self.save_json(places_data, map_id)
		places_data.each do |index, place|
			if Place.find_by_latitude(place["latitude"]).nil? && Place.find_by_longitude(place["longitude"]).nil?
				@place = Place.new(place)
				@place.save
				if index.to_i < 5
					@map = Map.find(map_id) 
					@map.places << @place
				end
			end
		end
	end

end