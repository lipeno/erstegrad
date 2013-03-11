class StoryImagesController < ApplicationController
    def destroy
    @story_image = StoryImage.find(params[:id])
    @story = @story_image.story
    @story.story_images.find(@story_image.id).destroy

    respond_to do |format|
      format.html { redirect_to @story }
      format.json { head :no_content }
    end
  end
end
