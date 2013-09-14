class ChangeTypeOnCharacter < ActiveRecord::Migration
  def change
    rename_column :characters, :type, :char_class
  end
end
