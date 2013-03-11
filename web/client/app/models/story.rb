class Story < ActiveRecord::Base
  attr_accessible :story_images_attributes, :title, :description
  
  belongs_to :user
  
  has_many :story_images
  accepts_nested_attributes_for :story_images
end
