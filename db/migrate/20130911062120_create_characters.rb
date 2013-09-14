class CreateCharacters < ActiveRecord::Migration
  def change
    create_table :characters do |t|
      t.string :name
      t.string :type
      t.text :char_sheet
      t.text :vocabulary

      t.timestamps
    end
  end
end
