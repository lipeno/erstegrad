class StoryImage < ActiveRecord::Base
  attr_accessible :image, :image_file_name, :image_content_type, :image_file_size, :image_updated_at
    
  belongs_to :story
  
  has_attached_file :image
end
