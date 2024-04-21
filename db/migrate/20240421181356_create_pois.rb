class CreatePois < ActiveRecord::Migration[7.1]
  def change
    create_table :pois do |t|
      t.float :longitude
      t.float :latitude
      t.text :description
      t.timestamps
    end
  end
end
