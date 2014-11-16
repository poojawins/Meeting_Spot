class MapPlace < ActiveRecord::Base
  belongs_to :map
  belongs_to :place
end
