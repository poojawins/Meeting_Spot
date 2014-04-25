class PlacesController < ApplicationController
	
	def create
		respond_to do |format|
			format.json { 
				Place.save_json(params["places"], params["map_id"])  
			}
		end
		redirect_to '/maps/'+params["map_id"]
	end

	def show
	end

	def selection
		@map = Map.find(params["map_id"])
		@places = @map.places
		respond_to do |format|
  		format.js {render :json => @places}
		end
	end

	def update
	end

end
