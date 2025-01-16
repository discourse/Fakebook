import UserLink from "discourse/components/user-link";
import avatar from "discourse/helpers/avatar";
import formatDate from "discourse/helpers/format-date";

const TopicOp = <template>
  <div class="topic-list-op">
    <UserLink @user={{@topic.creator}}>
      {{avatar @topic.creator imageSize="medium"}}
      <span class="username">
        {{@topic.creator.username}}
      </span>
      {{formatDate @topic.createdAt format="tiny"}}
    </UserLink>
  </div>
</template>;

export default TopicOp;
