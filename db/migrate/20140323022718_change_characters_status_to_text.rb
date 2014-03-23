class ChangeCharactersStatusToText < ActiveRecord::Migration
  def change
    change_column :characters, :status, :text, :default => ''
  end
end
