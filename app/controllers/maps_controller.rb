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
    @map = Map.new(params[:map])
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

