const TopicThumbnail = <template>
  {{#if @outletArgs.topic.thumbnails}}
    <img
      class="topic-thumbnail"
      srcset="{{@outletArgs.topic.thumbnails.2.url}} 1x, {{@outletArgs.topic.thumbnails.1.url}} 2x"
      src="{{@outletArgs.topic.thumbnails.1.url}}"
      alt=""
    />
  {{/if}}
</template>;

export default TopicThumbnail;
