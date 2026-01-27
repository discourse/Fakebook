export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Avoid the `onclick` attribute",
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    return {
      GlimmerAttrNode(node) {
        if (node.name === "onclick") {
          context.report({
            node,
            message:
              'Do not use `onclick` attribute. Use `{{on "click" ...}}` modifier instead.',
          });
        }
      },
    };
  },
};
