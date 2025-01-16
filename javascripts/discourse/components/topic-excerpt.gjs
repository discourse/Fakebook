import dirSpan from "discourse/helpers/dir-span";

const TopicExcerpt = <template>
  <div class="topic-excerpt">
    {{dirSpan @outletArgs.topic.escapedExcerpt htmlSafe="true"}}
  </div>
</template>;

export default TopicExcerpt;
