export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Convert 'inject as service' to 'service'",
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === "@ember/service") {
          node.specifiers.forEach((specifier) => {
            if (
              specifier.type === "ImportSpecifier" &&
              specifier.imported.name === "inject" &&
              specifier.local.name === "service"
            ) {
              context.report({
                node: specifier,
                message:
                  "Use direct 'service' import instead of 'inject as service'.",
                fix(fixer) {
                  return fixer.replaceText(specifier, "service");
                },
              });
            }
          });
        }
      },
    };
  },
};
