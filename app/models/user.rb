class User < ActiveRecord::Base
  has_many :addresses
  has_many :maps, :through => :addresses

end