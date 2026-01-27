const MATCHER =
  /^(admin\/|float-kit\/|select-kit\/|truth-helpers|dialog-holder\/)/;

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Use the updated import paths",
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        if (MATCHER.test(node.source.value)) {
          const correctedValue = `discourse/${node.source.value}`;
          context.report({
            node,
            message: `Use '${correctedValue}' instead of '${node.source.value}'`,
            fix(fixer) {
              return fixer.replaceText(node.source, `"${correctedValue}"`);
            },
          });
        }
      },
    };
  },
};
