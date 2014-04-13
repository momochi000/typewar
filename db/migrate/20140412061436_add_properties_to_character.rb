class AddPropertiesToCharacter < ActiveRecord::Migration
  def change
    add_column :characters, :properties, :text
  end
end
