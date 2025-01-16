import Component from "@glimmer/component";

export default class TopicThumbnail extends Component {
  get imgSrc1x() {
    return this.args.outletArgs.topic.thumbnails?.[2]?.url;
  }

  get imgSrc2x() {
    return this.args.outletArgs.topic.thumbnails?.[1]?.url;
  }

  <template>
    {{#if @outletArgs.topic.thumbnails}}
      <img
        class="topic-thumbnail"
        srcset="{{this.imgSrc1x}} 1x, {{this.imgSrc2x}} 2x"
        src={{this.imgSrc2x}}
        alt=""
      />
    {{/if}}
  </template>
}
