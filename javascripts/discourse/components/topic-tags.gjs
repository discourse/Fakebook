import discourseTags from "discourse/helpers/discourse-tags";

const TopicTags = <template>
  {{discourseTags
    @outletArgs.topic
    mode="list"
    tagsForUser=@outletArgs.tagsForUser
  }}
</template>;

export default TopicTags;
