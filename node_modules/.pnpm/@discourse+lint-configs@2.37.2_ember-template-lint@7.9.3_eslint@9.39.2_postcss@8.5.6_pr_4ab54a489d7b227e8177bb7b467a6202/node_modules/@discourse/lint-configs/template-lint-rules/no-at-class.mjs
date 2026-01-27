import { Rule } from "ember-template-lint";

const AFFECTED_COMPONENTS = [
  "DButton",
  "DModal",
  "TableHeaderToggle",
  "Textarea",
  "TextArea",
];

export default class NoAtClass extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (AFFECTED_COMPONENTS.includes(node.tag) && node.attributes) {
          node.attributes.forEach((attribute) => {
            if (attribute.name === "@class") {
              if (this.mode === "fix") {
                attribute.name = "class";
              } else {
                this.log({
                  message: `Use 'class' instead of '@class' for ${node.tag}.`,
                  node,
                  isFixable: true,
                });
              }
            }
          });
        }
      },
    };
  }
}
