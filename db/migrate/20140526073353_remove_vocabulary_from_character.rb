class RemoveVocabularyFromCharacter < ActiveRecord::Migration
  def change
    remove_column :characters, :vocabulary
  end
end
