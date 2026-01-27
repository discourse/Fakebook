import { fixImport } from "./utils/fix-import.mjs";

export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "disallow imports from 'i18n' and replace with 'discourse-i18n'",
    },
    fixable: "code",
    schema: [], // no options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value.toLowerCase() === "i18n") {
          context.report({
            node,
            message:
              "Import from 'i18n' is not allowed. Use 'discourse-i18n' instead.",
            fix(fixer) {
              return fixer.replaceText(node.source, `"discourse-i18n"`);
            },
          });
        }

        if (
          node.source.value.toLowerCase() === "discourse-common/helpers/i18n" ||
          node.source.value.toLowerCase() === "discourse/helpers/i18n"
        ) {
          context.report({
            node,
            message: `Import from '${node.source.value}' is not allowed. Use 'discourse-i18n' instead.`,
            fix(fixer) {
              const canSafelyReplace =
                node.specifiers.length === 1 &&
                node.specifiers[0].type === "ImportDefaultSpecifier";

              if (!canSafelyReplace) {
                return;
              }

              const localName = node.specifiers[0].local.name;
              let sourceName = node.source.value.match(/([^/]+)$/)[0];
              let importString;

              if (localName === sourceName) {
                importString = `${localName}`;
              } else {
                importString = `${sourceName} as ${localName}`;
              }

              const existingImport = context
                .getSourceCode()
                .ast.body.find(
                  (n) =>
                    n.type === "ImportDeclaration" &&
                    n.source.value === "discourse-i18n"
                );

              if (existingImport) {
                return [
                  fixer.remove(node),
                  fixImport(fixer, existingImport, {
                    namedImportsToAdd: [importString],
                  }),
                ];
              } else {
                return fixer.replaceText(
                  node,
                  `import { ${importString} } from "discourse-i18n";`
                );
              }
            },
          });
        }
      },
    };
  },
};
