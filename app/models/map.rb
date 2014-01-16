class Map < ActiveRecord::Base
  has_many :addresses
  attr_accessor :city

end