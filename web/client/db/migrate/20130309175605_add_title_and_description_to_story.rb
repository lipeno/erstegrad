class AddTitleAndDescriptionToStory < ActiveRecord::Migration
  def change
    change_table(:users) do |t|
      t.string :title
      t.string :description
    end
  end
end
