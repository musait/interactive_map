class PoisController < ApplicationController

    def index
      @pois = Poi.all
      render json: @pois
    end

    def create
        @poi = Poi.new(poi_params)
    
        if @poi.save
          # Send back the POI as JSON
          render json: @poi, status: :created
        else
          render json: @poi.errors, status: :unprocessable_entity
        end
      end
    
      private
    
      def poi_params
        params.require(:poi).permit(:longitude, :latitude, :description)
      end
end
