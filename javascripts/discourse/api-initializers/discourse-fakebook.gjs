import { withPluginApi } from "discourse/lib/plugin-api";
import dIcon from "discourse-common/helpers/d-icon";
import CustomSidebar from "../components/custom-sidebar";
import TopicExcerpt from "../components/topic-excerpt";
import TopicLikes from "../components/topic-likes";
import TopicOp from "../components/topic-op";
import TopicTags from "../components/topic-tags";
import TopicThumbnail from "../components/topic-thumbnail";

export default {
  name: "discourse-topic-list-cards",

  initialize() {
    withPluginApi("1.39.0", (api) => this.initWithApi(api));
  },

  initWithApi(api) {
    api.renderInOutlet("discovery-below", <template>
      <CustomSidebar />
    </template>);

    api.registerValueTransformer("topic-list-item-mobile-layout", () => false);
    api.registerValueTransformer("topic-list-columns", ({ value: columns }) => {
      columns.add("topic-op", { item: TopicOp }, { before: "topic" });
      columns.add("topic-likes", { item: TopicLikes }, { before: "replies" });

      columns.delete("posters");
      columns.delete("activity");
      columns.delete("likes");
      columns.delete("op-likes");
      columns.delete("views");

      return columns;
    });

    api.renderInOutlet("topic-list-before-reply-count", <template>
      {{dIcon "far-comment"}}
    </template>);
    api.renderInOutlet("topic-list-main-link-bottom", TopicExcerpt);
    api.renderInOutlet("topic-list-main-link-bottom", TopicTags);
    api.renderInOutlet("topic-list-main-link-bottom", TopicThumbnail);
  },
};
