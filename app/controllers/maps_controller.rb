class MapsController < ApplicationController

  def index
    @maps = Map.all
  end

  def show
    @map = Map.find(params[:id])
  end

  def new
    @map = Map.new
  end

  def create
    middle_ground_lat = Geocoder.coordinates(params[:map][:city])[0]
    middle_ground_long = Geocoder.coordinates(params[:map][:city])[1]
    @map = Map.new(:name => params[:map][:name], :middle_ground_lat => middle_ground_lat, :middle_ground_long => middle_ground_long)
    if @map.save
      redirect_to @map
    else
      render new
    end
  end

  def edit
    @map = Map.find(params[:id])
  end

  def update
    @map = Map.find(params[:id])
    if @map.update_attributes(params[:map])
      redirect_to @map
    else
      render 'edit'
    end
  end

  def destroy
    @map = Map.delete(params[:id])
  end

end

