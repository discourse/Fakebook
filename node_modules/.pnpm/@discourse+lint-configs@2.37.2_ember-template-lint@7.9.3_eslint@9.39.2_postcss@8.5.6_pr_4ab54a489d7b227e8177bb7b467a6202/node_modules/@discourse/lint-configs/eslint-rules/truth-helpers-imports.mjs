export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "use the shorter form of truth-helpers import",
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value.startsWith("truth-helpers/helpers/")) {
          context.report({
            node,
            message: `It is recommended to use 'truth-helpers' import instead of '${node.source.value}'.`,
            fix(fixer) {
              let code;
              const localName = node.specifiers[0].local.name;
              let sourceName = node.source.value.match(/([^/]+)$/)[0];

              if (sourceName === "not-eq") {
                sourceName = "notEq";
              }

              if (localName === sourceName) {
                code = `import { ${localName} } from 'truth-helpers';`;
              } else {
                code = `import { ${sourceName} as ${localName} } from 'truth-helpers';`;
              }

              return fixer.replaceText(node, code);
            },
          });
        }
      },
    };
  },
};
