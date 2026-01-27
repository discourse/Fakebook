export default {
  meta: {
    type: "problem",
    docs: {
      description:
        'disallow document.querySelector("body") and document.querySelector("html")',
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
          callee.object.name === "document" &&
          callee.property.name === "querySelector" &&
          args.length === 1 &&
          args[0].type === "Literal"
        ) {
          if (args[0].value === "body") {
            context.report({
              node,
              message:
                'Avoid using document.querySelector("body"). Use document.body instead.',
              fix: (fixer) => fixer.replaceText(node, "document.body"),
            });
          } else if (args[0].value === "html") {
            context.report({
              node,
              message:
                'Avoid using document.querySelector("html"). Use document.documentElement instead.',
              fix: (fixer) =>
                fixer.replaceText(node, "document.documentElement"),
            });
          }
        }
      },
    };
  },
};
