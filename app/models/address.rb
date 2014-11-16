class Address < ActiveRecord::Base
  attr_accessible :place, :name
  validates :place, :presence => true
  belongs_to :map
  belongs_to :user
  geocoded_by :place   # can also be an IP address
  after_validation :geocode,  if: ->(obj){ obj.place.present? and obj.place_changed? } # auto-fetch coordinates
end
