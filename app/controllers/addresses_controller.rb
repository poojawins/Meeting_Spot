class AddressesController < ApplicationController
  def index
    @addresses = Address.all
  end

  def new
    @map = Map.find(params[:id])
    # @address = Address.
    # @map.add
  end

  def create
    @map = Map.find(params[:map_id])
    @address = Address.new(params[:map][:addresses_attributes]["0"])
    @map.addresses << @address


    # @address = Address.new(params[:address])
    # @map = params[:id]
     # if @address.save 
    #   # redirect_to map_address_path
    # redirect_to "/maps/#{@map.id}"
      # redirect_to "/maps/#{@map}/addresses/#{@address.id}"
    # else
    #   render new
     # end
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