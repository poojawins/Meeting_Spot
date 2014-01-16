class Address < ActiveRecord::Base
	attr_accessible :place, :name
  belongs_to :map
	geocoded_by :place   # can also be an IP address
	after_validation :geocode,  if: ->(obj){ obj.address.present? and obj.address_changed? }          # auto-fetch coordinates
end