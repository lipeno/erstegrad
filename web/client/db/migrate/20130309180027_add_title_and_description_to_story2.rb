class AddTitleAndDescriptionToStory2 < ActiveRecord::Migration
  def change
    change_table(:stories) do |t|
      t.string :title
      t.string :description
    end
    remove_column :users, :title
    remove_column :users, :description
  end
end
