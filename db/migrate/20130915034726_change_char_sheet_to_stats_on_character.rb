class ChangeCharSheetToStatsOnCharacter < ActiveRecord::Migration
  def change
    rename_column :characters, :char_sheet, :stats
  end
end
