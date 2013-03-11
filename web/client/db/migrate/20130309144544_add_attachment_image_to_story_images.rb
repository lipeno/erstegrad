class AddAttachmentImageToStoryImages < ActiveRecord::Migration
  def self.up
    change_table :story_images do |t|
      t.attachment :image
    end
  end

  def self.down
    drop_attached_file :story_images, :image
  end
end
