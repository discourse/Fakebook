import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import { service } from "@ember/service";
import BadgeButton from "discourse/components/badge-button";
import ConditionalLoadingSpinner from "discourse/components/conditional-loading-spinner";
import DButton from "discourse/components/d-button";
import UserStat from "discourse/components/user-stat";
import concatClass from "discourse/helpers/concat-class";
import replaceEmoji from "discourse/helpers/replace-emoji";
import routeAction from "discourse/helpers/route-action";
import { ajax } from "discourse/lib/ajax";
import { i18n } from "discourse-i18n";

export default class CustomSidebar extends Component {
  @service currentUser;

  @tracked userDetails;
  @tracked loading;

  @action
  async fetchUserDetails() {
    this.loading = true;
    if (!this.currentUser) {
      this.loading = false;
      return;
    }

    try {
      const response = await ajax(
        `/u/${this.currentUser.username}/summary.json`
      );
      this.userDetails = response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching user details:", error);
    } finally {
      this.loading = false;
    }
  }

  <template>
    <div class="dbook-sidebar" {{didInsert this.fetchUserDetails}}>
      <ConditionalLoadingSpinner @condition={{this.loading}}>
        {{#if settings.sidebar_show_intro}}
          <h2>
            {{i18n (themePrefix "sidebar.welcome")}}
            {{#if this.currentUser.username}}
              {{i18n (themePrefix "sidebar.back")}}
              {{this.currentUser.username}}
            {{/if}}
          </h2>
          <p>{{i18n (themePrefix "sidebar.welcome_subhead")}}</p>
        {{/if}}

        {{#if settings.sidebar_show_likes}}
          {{#if this.userDetails.user_summary}}
            <div class="likes">
              <h3>{{i18n (themePrefix "sidebar.likes_header")}}</h3>
              <UserStat
                @value={{this.userDetails.user_summary.likes_received}}
                @icon="heart"
                @label="user.summary.likes_received.other"
              />
              <UserStat
                @value={{this.userDetails.user_summary.likes_given}}
                @icon="heart"
                @label="user.summary.likes_given.other"
              />
            </div>
          {{/if}}
        {{/if}}

        {{#if settings.sidebar_show_badges}}
          {{#if this.userDetails.badges}}
            <div class="badges">
              <h3>{{i18n (themePrefix "sidebar.badges_header")}}</h3>
              {{#each this.userDetails.badges as |b|}}
                <a href="/badges/{{b.id}}/{{b.slug}}">
                  <BadgeButton
                    @badge={{b}}
                    class={{concatClass "badge-type-" b.badge_type_id}}
                  >
                    {{#if b.multiple_grant}}
                      <span
                        class="count"
                      >&nbsp;(&times;{{b.grant_count}})</span>
                    {{/if}}
                  </BadgeButton>
                </a>
              {{/each}}
            </div>
          {{/if}}
        {{/if}}

        {{#unless this.currentUser}}
          <div class="visitor">
            {{replaceEmoji (i18n "signup_cta.value_prop")}}
            <DButton
              @action={{routeAction "showCreateAccount"}}
              class="btn-primary sign-up-button"
              @label="sign_up"
            />
          </div>
        {{/unless}}
      </ConditionalLoadingSpinner>

      {{#if this.currentUser}}
        <a class="sidebar-link" href="/my/summary">
          {{i18n (themePrefix "sidebar.full_profile")}}
        </a>
      {{/if}}
    </div>
  </template>
}
