class CreateText < ActiveRecord::Migration
  def change
    create_table :texts do |t|
      t.text :content
      
      t.timestamps
    end
  end
end
