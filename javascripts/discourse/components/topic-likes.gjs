import dIcon from "discourse/helpers/d-icon";

const TopicLikes = <template>
  <div class="topic-likes">
    {{@topic.like_count}}
    {{dIcon "heart"}}
  </div>
</template>;

export default TopicLikes;
