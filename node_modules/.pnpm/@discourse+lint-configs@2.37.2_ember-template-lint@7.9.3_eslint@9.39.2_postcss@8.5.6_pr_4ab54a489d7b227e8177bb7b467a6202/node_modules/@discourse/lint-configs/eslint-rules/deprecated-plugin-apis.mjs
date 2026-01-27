export default {
  meta: {
    type: "problem",
    docs: {
      description: "prevent using deprecated plugin APIs",
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    return {
      CallExpression(node) {
        const { callee, arguments: args } = node;

        if (
          callee.type === "MemberExpression" &&
          callee.property.name === "registerConnectorClass" &&
          args.length === 3
        ) {
          context.report({
            node,
            message:
              "registerConnectorClass is deprecated. Create a glimmer component in a plugin connector directory or use renderInOutlet instead.",
          });
        } else if (
          callee.type === "MemberExpression" &&
          callee.property.name === "decoratePluginOutlet" &&
          args.length === 2
        ) {
          context.report({
            node,
            message:
              "decoratePluginOutlet is deprecated. Use element modifiers on a component instead.",
          });
        }
      },
    };
  },
};
