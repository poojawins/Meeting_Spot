class Place < ActiveRecord::Base
  has_many :map_places
  has_many :maps, :through => :map_places

end