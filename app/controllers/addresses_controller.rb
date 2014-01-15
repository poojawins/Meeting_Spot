class AddressesController < ApplicationController
  def index
    @addresses = Address.all
  end

  def new
    @address = Address.new
  end

  def create
    @address = Address.new(params[:address])
    @map = params[:map_id]
    if @address.save 
      # redirect_to map_address_path
      redirect_to "/maps/#{@map}/addresses/#{@address.id}"
    else
      render new
    end
  end

  def show
    @address = Address.find(params[:id])
  end

  def edit
    @address = Address.find(params[:id])
  end

  def update
    @address = Address.find(params[:id])
    if @address.update_attributes(params[:address])
      redirect_to @address
    else
      render 'edit'
    end
  end


  def destroy
    @address = Address.find(params[:id]).delete
  end


end