class AddStatusToCharacter < ActiveRecord::Migration
  def change
    add_column :characters, :status, :string, :default => ''
  end
end
