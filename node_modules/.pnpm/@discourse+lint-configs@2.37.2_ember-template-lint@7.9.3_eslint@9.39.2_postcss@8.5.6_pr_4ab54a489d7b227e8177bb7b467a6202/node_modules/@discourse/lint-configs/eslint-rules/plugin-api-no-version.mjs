export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "remove the deprecated version argument from apiInitializer/withPluginApi calls",
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.name === "apiInitializer" ||
          node.callee.name === "withPluginApi"
        ) {
          if (
            node.arguments.length >= 2 &&
            node.arguments[0].type === "Literal"
          ) {
            context.report({
              node: node.arguments[0],
              message: `Specifying plugin api version in ${node.callee.name} is no longer necessary`,
              fix(fixer) {
                const arg = node.arguments[0];
                const punctuatorToken = context.sourceCode.getTokenAfter(arg);
                const nextToken =
                  context.sourceCode.getTokenAfter(punctuatorToken);

                return fixer.removeRange([arg.range[0], nextToken.range[0]]);
              },
            });
          }
        }
      },
    };
  },
};
