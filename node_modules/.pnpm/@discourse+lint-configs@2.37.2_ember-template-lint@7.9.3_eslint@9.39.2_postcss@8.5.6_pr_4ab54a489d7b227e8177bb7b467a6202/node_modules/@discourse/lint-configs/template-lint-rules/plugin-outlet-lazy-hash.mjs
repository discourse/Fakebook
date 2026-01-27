import { Rule } from "ember-template-lint";

export default class PluginOutletLazyHash extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag === "PluginOutlet") {
          const outletArgsAttr = node.attributes.find(
            (attr) => attr.name === "@outletArgs"
          );

          if (
            outletArgsAttr &&
            outletArgsAttr.value.type === "MustacheStatement" &&
            outletArgsAttr.value.path.original === "hash"
          ) {
            this.log({
              message:
                "Use {{lazyHash}} instead of {{hash}} for @outletArgs in <PluginOutlet>.",
              node: outletArgsAttr.value,
            });
          }
        }
      },
    };
  }
}
